// Common credentials for Github API Access! - Tokens are set to expire after one-day
const owner = 'felipefinch';
const repo = 'pruned';
const resumes_PATH = 'MData/';

// Select the anchor element using its ID
const link = document.getElementById("commitHistory");
const commitLine = document.getElementById("htLine");

// Attach the click event listener
link.addEventListener("click", function(event) {
    // Prevent the default browser redirection
    event.preventDefault();

    // Your custom logic runs here
    getFileCommits(`${owner}`, `${repo}`, `${resumes_PATH}`);
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

async function getFileCommits(owner, repo, filePath) {
    const url = `https://api.github.com/repos/${owner}/${repo}/commits?path=${encodeURIComponent(filePath)}`;

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

        // Clear-out innerHTML & Elements for each iteration
        listContainer.replaceChildren();
        headContainer.replaceChildren();

        // Append the commit history main title
        headContainer.append(`Commit History for : ../${filePath} folder!`);

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
            }
        });

    } catch (error) {
        console.error("Failed to fetch commits:", error);
    }
}

// BROKEN AT THE MOMENT!
function parseCommitContent(_contentMessage) {
    const myString = _contentMessage;
    const _result = "";

    if (myString.startsWith("-")) {
        // Split into an array, removing the leading empty entry if desired
        _result = myString.split("-").filter(part => part !== "");

        for (var i = 0; i < _result.length; i++) {
            _result[i].replace(/\r?\n$/, ""); // ["data", "value"]
        }

    } else { _result = _contentMessage; }

    return _result;
}

function parseCommitSubject(commitMessage) {
    // Split the message at the first double newline
    const parts = commitMessage.split(/\n\n(.*)/s);

    return {
        title: parts[0].trim(),
        content: parts[1] ? parts[1].trim() : "" // Returns empty string if no body exists
    };
}


async function listGitHubFiles() {
    const url = `https://api.github.com/repositories/1230097187/contents/afiles`;

    try {
        const response = await fetch(url);
        const files = await response.json();
        const listElement = document.getElementById('file-list');

        files.forEach(file => {
            // Create a list item and link for each file
            const li = document.createElement('li');
            const a = document.createElement('a');

            // Use 'download_url' for raw file access or 'html_url' for the GitHub UI
            a.href = file.download_url.split('/').slice(-2).join('/');
            console.log(a.href);
            a.textContent = file.name;

            li.appendChild(a);
            listElement.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching files:', error);
    }
}

// Call and list files on page load.
listGitHubFiles();

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