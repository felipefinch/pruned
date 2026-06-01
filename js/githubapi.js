export async function listGithubFolder(_folder_name) {
    const url = `https://api.github.com/repositories/1230097187/contents/${_folder_name}`;

    try {
        const _response = await fetch(url);
        const _files = await _response.json();
        const _ul = document.createElement('ul');

        _files.forEach(_f => {
            // Create a list item and link for each file
            const _a = document.createElement('a');
            const _li = document.createElement('li');

            // Use 'download_url' for raw file access or 'html_url' for the GitHub UI
            _a.href = _f.download_url.split('/').slice(-2).join('/');
            _a.textContent = _f.name;

            _li.appendChild(_a);
            _ul.appendChild(_li);
        });


        return _ul.outerHTML;

    } catch (error) {
        console.error('Error fetching files:', error);
    }
}