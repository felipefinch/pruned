import {
    CTemplates,
    NavSlideOut, ResumeList
} from './component_construct.js';

// Common credentials for Github API Access! - Tokens are set to expire after one-day
const owner = 'felipefinch';
const repo = 'pruned';
const resumes_PATH = 'MData/';

// Essential Navigation Rendering at Startup!
const _loadTemplateString = CTemplates.sideNavSlideOut;
const profileCompiled = Handlebars.compile(_loadTemplateString);
const renderedHtml = profileCompiled({
    navItem: [{
            navbar_li_id: "resume-id",
            navbar_li_class: "resume",
            navbar_link_title: "Resume List"
        },
        {
            navbar_li_id: "commit-id",
            navbar_li_class: "commit",
            navbar_link_title: "Commit History"
        },
        {
            navbar_li_id: "raw-id",
            navbar_li_class: "json",
            navbar_link_title: "RAW JSON"
        }
    ]
});

document.querySelector('.navigation').innerHTML = renderedHtml;

// Mousedown (vs Click's)
addEventListener('mousedown', (event) => {
    event.preventDefault();
    const _eID = event.target.id;
    const _etarget = event.target.classList;

    // Individual Component Calls & Site Functionality
    NavSlideOut();
    _eID === "resume-id" ? ResumeList() : null;
});

// MouseUP (vs Click's)
addEventListener('mouseup', (event) => {
    event.preventDefault();
    const _eID = event.target.id;
    const _etarget = event.target.classList;

    if (_eID === "resume-id") {
        document.querySelector(".sliding-navbar").classList.toggle('sliding-navbar--open');
        document.querySelector(".mask").classList.remove('show');
        document.querySelector(".hamburger").classList.toggle('menu-opened');
    }
});

function grabMDFile(nameOfFile) {
    console.log("What is name of MD file? " + nameOfFile);

    fetch(nameOfFile) // ex. README.MD - Must be in the same repo for GitHub Pages
        .then(response => {
            if (!response.ok) throw new Error("Markdown file not found");
            return response.text();
        })
        .then(md => {
            document.getElementById('content').innerHTML = marked.parse(md);
        })
        .catch(err => {
            document.getElementById('content').textContent = "Error loading content.";
            console.error(err);
        });

    return null;
}

async function getRawJson(_owner, _repo, _filepath) {
    const url = `https://api.github.com/repos/${_owner}/${_repo}/commits?path=${encodeURIComponent(_filepath)}`;

    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/vnd.github+json',
                //'Authorization': `Bearer ${token}`, // Remove if not using a token
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const commits = await response.json();
        const listContainer = document.getElementById('commit-list');
        const headContainer = document.getElementById('history-title');

        console.log(commits);

        // Clear-out innerHTML & Elements for each iteration
        listContainer.replaceChildren();
        headContainer.replaceChildren();

        // Append the commit history main title
        headContainer.append(`Commit History for : ../${_filepath} folder!`);

        commits.forEach(commit => {
            // Raw Output for commit messages: title & subjects
            // console.log(`${commit.sha.substring(0, 7)}: ${commit.commit.message} (${commit.commit.author.date})`);

            const _full_message = parseCommitSubject(`${commit.commit.message}`);
            const _subject = _full_message.title;
            const _content = _full_message.content;
            const parentli = document.createElement('li');

            parentli.textContent = _subject // Assuming data has a 'name' property
            listContainer.appendChild(parentli);

            if (_content) {
                const sub_ul = document.createElement('ul');
                const sub_li = document.createElement('li');
                // const _multiContent = parseCommitContent(_content);

                // for (var i = 0; i < _multiContent.length; i++) {

                //     console.log("Multi-Content: " + _multiContent[i]);
                //     parentli.appendChild(sub_ul);
                //     sub_li.textContent = _multiContent[i];
                //     sub_ul.appendChild(sub_li);
                // }
                parentli.appendChild(sub_ul);
                sub_li.textContent = _content;
                sub_ul.appendChild(sub_li);

                parseCommitContent(_content);
            }
        });

    } catch (error) {
        console.error("Failed to fetch commits:", error);
    }
}

async function getFileCommits(_owner, _repo, _filepath) {
    const url = `https://api.github.com/repos/${_owner}/${_repo}/commits?path=${encodeURIComponent(_filepath)}`;

    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/vnd.github+json',
                //'Authorization': `Bearer ${token}`, // Remove if not using a token
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const commits = await response.json();
        const listContainer = document.getElementById('commit-list');
        const headContainer = document.getElementById('history-title');

        console.log(commits);

        // Clear-out innerHTML & Elements for each iteration
        listContainer.replaceChildren();
        headContainer.replaceChildren();

        // Append the commit history main title
        headContainer.append(`Commit History for : ../${_filepath} folder!`);

        commits.forEach(commit => {
            // Raw Output for commit messages: title & subjects
            // console.log(`${commit.sha.substring(0, 7)}: ${commit.commit.message} (${commit.commit.author.date})`);

            const _full_message = parseCommitSubject(`${commit.commit.message}`);
            const _subject = _full_message.title;
            const _content = _full_message.content;
            const parentli = document.createElement('li');

            parentli.textContent = _subject // Assuming data has a 'name' property
            listContainer.appendChild(parentli);

            if (_content) {
                const sub_ul = document.createElement('ul');
                const sub_li = document.createElement('li');
                // const _multiContent = parseCommitContent(_content);

                // for (var i = 0; i < _multiContent.length; i++) {

                //     console.log("Multi-Content: " + _multiContent[i]);
                //     parentli.appendChild(sub_ul);
                //     sub_li.textContent = _multiContent[i];
                //     sub_ul.appendChild(sub_li);
                // }
                parentli.appendChild(sub_ul);
                sub_li.textContent = _content;
                sub_ul.appendChild(sub_li);

                parseCommitContent(_content);
            }
        });

    } catch (error) {
        console.error("Failed to fetch commits:", error);
    }
}

function parseCommitContent(_contentMessage) {
    const myString = _contentMessage;
    let _result = "";

    if (myString.startsWith("-")) {
        // Split into an array, removing the leading empty entry if desired
        _result = myString.split("- ").filter(part => part !== "");
        console.log(_result);

        for (var i = 0; i < _result.length; i++) {

            // Remove any carriage-returns \n
            _result[i].replace(/\r?\n$/, ""); // ["data", "value"]
            console.log(_result[i]);
        }

        if (_result.length <= 1) {
            console.log("Result is only one string value");
        }
    }
}

function parseCommitSubject(commitMessage) {
    // Split the message at the first double newline
    const parts = commitMessage.split(/\n\n(.*)/s);

    return {
        title: parts[0].trim(),
        content: parts[1] ? parts[1].trim() : "" // Returns empty string if no body exists
    };
}

// Call and list files on page load.
// listGitHubFiles();

// Example usage:
// const commit = "fix(auth): resolve login redirect issue\n\nUsers were being redirected to the homepage instead of the requested dashboard. Updated the redirect logic in the auth controller.";
// const parsed = parseCommitSubject(commit);

// console.log("Title:", parsed.title);
// // Output: fix(auth): resolve login redirect issue

// console.log("Content:", parsed.content);
// // Output: Users were being redirected to the homepage instead of the requested dashboard. Updated the redirect logic in the auth controller.

// async function listCommitHistory() {
//   const url = `https://api.github.com/repos/felipfinch/pruned/commits`;

//   try {
//     const response = await fetch(url);
//     const files = await response.json();
//     const listElement = document.getElementById('commit-list');

//     listElement.replaceChildren(); // Clear out innerHTML elements.

//     files.forEach(file => {
//       // Create a list item and link for each file
//       const li = document.createElement('li');
//       const a = document.createElement('a');

//       // Use 'download_url' for raw file access or 'html_url' for the GitHub UI
//       a.href = file.download_url.split('/').slice(-2).join('/');
//       console.log(a.href);
//       a.textContent = file.name;

//       li.appendChild(a);
//       listElement.appendChild(li);
//     });
//   } catch (error) {
//     console.error('Error fetching files:', error);
//   }
// }

// function listMDFiles() {
//     (async function () {
//         const owner = "YOUR_GITHUB_USERNAME"; // e.g., "octocat"
//         const repo = "YOUR_REPO_NAME";        // e.g., "my-website"
//         const path = "YOUR_FOLDER_PATH";      // e.g., "assets/images"
//         const branch = "main";                // or "master"

//         const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;

//         try {
//             const response = await fetch(apiUrl);
//             if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
//             const files = await response.json();

//             const list = document.getElementById("file-list");
//             files.forEach(file => {
//                 if (file.type === "file") {
//                     const li = document.createElement("li");
//                     const link = document.createElement("a");
//                     link.href = file.download_url;
//                     link.textContent = file.name;
//                     li.appendChild(link);
//                     list.appendChild(li);
//                 }
//             });
//         } catch (err) {
//             console.error(err);
//             document.getElementById("file-list").textContent = "Error loading file list.";
//         }
//     })();
// }