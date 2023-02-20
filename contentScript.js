const getMeaning = async (word) => {
  const baseUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/";
  const wordUrl = baseUrl + word;
  try {
    const response = await fetch(wordUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

const getDiv = (partOfSpeech, definitions) => {
  const baseDiv = document.createElement("div");
  const baseDivHtml = `<div>
    <h3> ${partOfSpeech}</h3>
  </div>`;
  baseDiv.innerHTML = baseDivHtml;
  definitions.forEach((definitionObject) => {
    const paraElement = document.createElement("p");
    const para = `<p>${definitionObject.definition}</p>`;
    paraElement.innerHTML = para;
    baseDiv.appendChild(paraElement);
  });
  return baseDiv;
};

const generateMeaningDiv = async (word) => {
  const meaningArray = await getMeaning(word);
  const meaningDiv = document.createElement("div");
  meaningDiv.id = "meaning";
  meaningDiv.style.display = "hidden";
  meaningArray[0].meanings.forEach((meaning) => {
    const definitions = meaning.definitions;
    const partOfSpeech = meaning.partOfSpeech;
    const baseDiv = getDiv(partOfSpeech, definitions);
    meaningDiv.appendChild(baseDiv);
  });
  return meaningDiv;
};

const activateExtension = () => {
  let overlayDiv = document.createElement("DIV");
  overlayDiv.classList.add("contract");
  overlayDiv.id = "myOverLay";
  overlayDiv.innerHTML = `<button id="read">Open</button>`;
  document.body.appendChild(overlayDiv);
  let openBtn = document.getElementById("read");
  openBtn.classList.add("openButton");

  let isSelecting = false;
  let selectedText = "";
  let isOverLayOpen = false;

  document.addEventListener("selectionchange", async () => {
    const newSelectedText = window.getSelection().toString();
    if (newSelectedText !== "") {
      isSelecting = true;
      selectedText = newSelectedText;
    } else {
      if (isSelecting) {
        isSelecting = false;
        openBtn.style.background = "green";
        const previousMeaningElement = document.getElementById("meaning");
        if (previousMeaningElement) {
          previousMeaningElement.remove();
        }
        const meaningDiv = await generateMeaningDiv(selectedText);
        overlayDiv.appendChild(meaningDiv);
      }
    }
  });

  openBtn.addEventListener("click", () => {
    if (!isOverLayOpen) {
      overlayDiv.classList.remove("contract");
      overlayDiv.classList.add("expand");
      openBtn.innerText = "Close";
      document.getElementById("meaning").style.display = "block";
      isOverLayOpen = true;
    } else {
      overlayDiv.classList.remove("expand");
      overlayDiv.classList.add("contract");
      openBtn.innerText = "Open";
      document.getElementById("meaning").style.display = "hidden";
      isOverLayOpen = false;
    }
  });
};

activateExtension();
