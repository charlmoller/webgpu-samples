import { createElem as el } from './utils/elem';
import { SampleInfo, SourceInfo, pageCategories } from './samples';

function getElem(
  selector: string,
  parent: HTMLElement | Document = document
): HTMLElement {
  return parent.querySelector(selector)!;
}

const sampleElem = getElem('#sample');
const sampleContainerElem = getElem('.sampleContainer', sampleElem);

// Get the parts of a string past the last `/`
const basename = (name: string) => name.substring(name.lastIndexOf('/') + 1);

// Handle when the URL changes (browser back / forward)
window.addEventListener('popstate', (e) => {
  e.preventDefault();
  parseURL();
});

// The current sample so we don't reload an iframe if the user picks the same sample.
let currentSampleInfo: SampleInfo | undefined;

/**
 * Change the iframe (and source editors) to the given sample or none
 */
function setSampleIFrame(
  sampleInfo: SampleInfo | undefined,
  search: string = ''
) {
  if (sampleInfo === currentSampleInfo) {
    return;
  }
  currentSampleInfo = sampleInfo;
  const { name, filename, url, sources } = sampleInfo || {
    name: '',
    description: '',
    filename: '',
    sources: [],
  };

  document.title = `${name}`;

  // Replace the iframe because changing src adds to the user's history.
  sampleContainerElem.innerHTML = '';
  if (filename) {
    const src = url || `${filename}${search}`;
    sampleContainerElem.appendChild(el('iframe', { src }));
    sampleContainerElem.style.height = '800px';
    sampleContainerElem.style.width = '800px';
    // hide intro and show sample
    sampleElem.style.display = '';
  } else {
    // hide intro and show sample
    sampleElem.style.display = 'none';
  }
}


// Samples are looked up by `?sample=key` so this is a map
// from those keys to each sample.
const samplesByKey = new Map<string, SampleInfo>();

// Generate the list of samples
for (const { samples } of pageCategories) {
  for (const [key, sampleInfo] of Object.entries(samples)) {
    samplesByKey.set(key, sampleInfo);
  }
}


/**
 * Parse the page's current URL and then set the iframe appropriately.
 */
function parseURL() {
  const url = new URL(location.toString());

  const sample = url.searchParams.get('sample') || 'gameOfLife';
  const sampleUrl = new URL(sample, location.href);
  const sampleInfo = samplesByKey.get(basename(sampleUrl.pathname));
  setSampleIFrame(sampleInfo, sampleUrl.search);
}

/**
 * Respond to messages from iframes. We have no way of knowing the size
 * of an example so there's a helper in `iframe-helper.js` that lets
 * the iframe tell us the size it needs (and possibly other things).
 * This lets us adjust the size of the iframe.
 */
window.addEventListener('message', (e) => {
  const { cmd, data } = e.data;
  switch (cmd) {
    case 'resize': {
      sampleContainerElem.style.height = `${data.height}px`;
      break;
    }
    default:
      throw new Error(`unknown message cmd: ${cmd}`);
  }
});

// Parse the first URL.
parseURL();
