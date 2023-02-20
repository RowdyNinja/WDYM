const fetchWordMeaning = async (word) => {
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

const createDiv = (partOfSpeech, definitions) => {
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

const createMeaningDiv = async (word) => {
  const meaningArray = await fetchWordMeaning(word);
  const meaningDiv = document.createElement("div");
  meaningDiv.id = "meaning";
  meaningDiv.classList.add("contract");
  meaningArray[0].meanings.forEach((meaning) => {
    const definitions = meaning.definitions;
    const partOfSpeech = meaning.partOfSpeech;
    const baseDiv = createDiv(partOfSpeech, definitions);
    meaningDiv.appendChild(baseDiv);
  });
  return meaningDiv;
};

const activateExtension = () => {
  let overlayDiv = document.createElement("DIV");
  overlayDiv.id = "myOverLay";
  overlayDiv.innerHTML = `<button id="read">Open</button>`;
  document.body.appendChild(overlayDiv);
  let openBtn = document.getElementById("read");
  openBtn.classList.add("openButton");

  let isSelecting = false;
  let selectedText = "";
  let isOverLayOpen = false;
  let isFetchComplete = false;

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
        const meaningDiv = await createMeaningDiv(selectedText);
        isFetchComplete = true;
        overlayDiv.appendChild(meaningDiv);
      }
    }
  });

  openBtn.addEventListener("click", () => {
    if (!isFetchComplete) return;
    const meaningDiv = document.getElementById("meaning");
    if (!isOverLayOpen) {
      overlayDiv.classList.add("expand");
      meaningDiv.classList.remove("contract");
      openBtn.innerText = "Close";
      isOverLayOpen = true;
    } else {
      overlayDiv.classList.remove("expand");
      meaningDiv.classList.add("contract");
      openBtn.innerText = "Open";
      isOverLayOpen = false;
    }
  });
};

activateExtension();
