function round(value: number) {
  if (value > 999) {
    let digits = +((value - 950) % 1000 > 99);
    return `${((value + 0.000001) / 1000).toFixed(digits)}k`;
  } else {
    return value.toString();
  }
}

async function get_stats(repo: string) {
  const response = await fetch("https://api.github.com/repos" + repo, {
    headers: {
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    redirect: "follow",
  });

  return response.json();
}

function get_repo_url() {
  const repoElem = document.querySelector("a.github-repository");
  if (repoElem == null) {
    return null;
  }
  const url_str = repoElem.getAttribute("href");
  if (url_str != null) {
    return new URL(url_str);
  }
  return null;
}

function append_element_stats<T extends Element>(
  elements: NodeListOf<T>,
  text: string,
  css_class: string
) {
  elements.forEach((elem) => {
    let child = document.createElement("li");
    child.setAttribute("class", `github-fact ${css_class}`);
    const txt = document.createTextNode(text);
    child.appendChild(txt);
    elem.appendChild(child);
  });
}

function update_repo_stats() {
  const url = get_repo_url();
  if (url == null) return;

  let stats_elem = document.querySelectorAll("ul.github-facts");

  get_stats(url.pathname).then((data) => {
    append_element_stats(
      stats_elem,
      round(data["stargazers_count"]),
      "github-fact-stars"
    );

    append_element_stats(
      stats_elem,
      round(data["forks_count"]),
      "github-fact-forks"
    );
  });
}

async function update_repo_stats_once() {
  document.removeEventListener("DOMContentLoaded", update_repo_stats);
  update_repo_stats();
}

document.addEventListener("DOMContentLoaded", update_repo_stats_once);
