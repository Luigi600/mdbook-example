const TOC_PAGE_DEPTHS_UNITS = [
  "depth-2", // h3
  "depth-3", // h4
  "depth-4", // h5
  "depth-5", // h6
];

// const LOCAL_STORAGE_KEY_TOC_VISIBLE_STATE = "toc_visible";

document.onscroll = () => {
  handleScrollingAndSetCSSVariables();
  selectPageChapter();
};

window.addEventListener("DOMContentLoaded", () => {
  createTOCOfCurrentPage();
  handleResponsivePageTOCOpener();
  // setSidebarVisibleState();
});

function handleResponsivePageTOCOpener() {
  const opener = document.querySelector("#page-toc-opener");
  opener.addEventListener("focus", () => {
    document.querySelector(".page-toc-menu")?.setAttribute("active", "true");
  });
  opener.addEventListener("blur", () => {
    setTimeout(() => {
      document.querySelector(".page-toc-menu")?.removeAttribute("active");
    }, 100); // wtf - that is not good but it works, why??
  });
}

function handleScrollingAndSetCSSVariables() {
  const headerHeight = parseInt(
    (
      getComputedStyle(document.documentElement).getPropertyValue(
        "--header-height"
      ) ?? "0"
    ).replace("px", "")
  );
  document.documentElement.style.setProperty(
    "--scrollbar-position-y",
    html.scrollTop + "px"
  );
  document.documentElement.style.setProperty(
    "--sidebar-cut-y",
    Math.max(headerHeight - html.scrollTop, 0) + "px"
  );
}

function selectPageChapter() {
  const hTitles = [
    ...document
      .getElementsByTagName("main")[0]
      .querySelectorAll("h2, h3, h4, h5, h6"),
  ].filter((hTitle) => !!getTOCChapterFromHElement(hTitle));

  hTitles.forEach((hTitle) => {
    getTOCChapterFromHElement(hTitle).removeAttribute("selected");
  });

  for (let i = 0; i < hTitles.length; ++i) {
    const tocItem = getTOCChapterFromHElement(hTitles[i]);
    const posY = hTitles[i].offsetTop - html.scrollTop;

    if (
      posY <= 0 &&
      ((i + 1 < hTitles.length &&
        hTitles[i + 1].offsetTop - html.scrollTop > 0) ||
        i === hTitles.length - 1)
    ) {
      tocItem.setAttribute("selected", "true");
      break;
    }
  }
}

function getTOCChapterFromHElement(hTitle) {
  return document
    .querySelector(".page-toc-tree")
    ?.querySelector(`#toc_${hTitle.querySelector("a").id}`);
}

function createTOCOfCurrentPage() {
  const text = document.getElementsByTagName("main")[0];
  if (!text || !text.innerHTML) return;

  const chapterTitles = [...text.querySelectorAll("h2")];
  const chapters = chapterTitles.map((hElement) => {
    return getChaptersInPage(hElement, 2);
  });

  const chapterTOC = document.querySelector(".page-toc-tree");
  createTOCTreeOfPageChapters(chapters).forEach((chapter) => {
    chapterTOC.appendChild(chapter);
  });
}

function getChaptersInPage(element, hLevel) {
  const result = {
    name: element.innerText,
    id: element.querySelector("a")?.id ?? null,
    chapters: [],
  };

  let sibling = { sibling: element };
  while (
    (sibling = getNextHTagSibling(sibling.sibling)) !== null &&
    sibling !== undefined &&
    sibling.hLevel === hLevel + 1
  ) {
    result.chapters.push(getChaptersInPage(sibling.sibling, sibling.hLevel));
  }

  return result;
}

function getNextHTagSibling(element) {
  let sibling = element;
  while ((sibling = sibling.nextSibling) !== undefined && sibling !== null) {
    if (/h[0-9]/i.test(sibling.tagName)) {
      const hLevel = parseInt(sibling.tagName.replace(/[A-Z.,-]/i, ""));
      return { sibling, hLevel };
    }
  }

  return null;
}

function createTOCTreeOfPageChapters(chapters, depthIndex = -1) {
  const result = [];

  for (const chapter of chapters) {
    const link = document.createElement("a");
    link.href = `#${chapter.id}`;
    if (depthIndex >= 0) {
      link.classList.add(TOC_PAGE_DEPTHS_UNITS[depthIndex]);
    }
    link.id = `toc_${chapter.id}`;
    const pTitle = document.createElement("p");
    pTitle.append(chapter.name);
    link.append(pTitle);
    result.push(link);

    if (chapter.chapters.length > 0) {
      result.push(
        ...createTOCTreeOfPageChapters(chapter.chapters, depthIndex + 1)
      );
    }
  }

  return result;
}

/*
function createTOCTreeOfPageChapters(chapters) {
  const ol = document.createElement("ol");

  for (const chapter of chapters) {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = `#${chapter.id}`;
    link.append(chapter.name);
    li.append(link);
    ol.append(li);

    if (chapter.chapters.length > 0) {
      const subLi = document.createElement("li");
      subLi.append(createTOCTreeOfPageChapters(chapter.chapters));
      ol.append(subLi);
    }
  }

  return ol;
}
 */
