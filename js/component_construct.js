import { listGithubFolder } from './githubapi.js';

// GENERAL TEMPLATE STRUCTURES : component_construct.js
export const CTemplates = {
    userProfile: `
    <div class="profile">
      <h2>{{user.firstName}}</h2>
      <p>{{role}}</p>
    </div>
  `,

    itemCard: `
    <div class="card">
      <h3>{{title}}</h3>
      <span>Price: \${{price}}</span>
    </div>
  `,
    resumeList: `
    <div id="resumes" class="desc resumes">
      <h2>{{title}}</h2>
      <hr>
    </div>
    `,
    sideNavSlideOut: `
    <div class="hamburger-menu">
        <div class="hamburger"></div>
    </div>
    <navbar class="sliding-navbar">
        <ul class="navbar--items">
          {{#each navItem}}
            <li id="{{navbar_li_id}}" class="navbar--item icon-link {{navbar_li_class}}">{{navbar_link_title}}</li>
          {{/each}}
        </ul>
    </navbar>
    <div class="mask"></div>
    `
};

// Hamburger & Slide-Out Functionality ==============================================================
export const NavSlideOut = () => {

    const _eID = event.target.id;
    const _etarget = event.target.classList;
    const _main = document.getElementById("maincontent");

    const _hamburger_menu = document.querySelector(".hamburger-menu");
    const _slider = document.querySelector(".sliding-navbar");
    const _mask = document.querySelector(".mask");
    const _hamburger = document.querySelector(".hamburger");
    const _commits = document.getElementById('#commit-history');

    const _burgerArea = _etarget.contains("hamburger") || _etarget.contains("hamburger-menu");
    const _maskTarget = event.target.classList.contains("mask");

    if (_burgerArea) {
        _slider.classList.toggle('sliding-navbar--open');
        _mask.classList.toggle('show');
        _hamburger.classList.toggle('menu-opened');
    }

    if (_maskTarget) {
        _slider.classList.toggle('sliding-navbar--open');
        _mask.classList.remove('show');
        _hamburger.classList.toggle('menu-opened');
    }

    if (_eID === "resume-id") resumeFileList(_eID);

    async function resumeFileList(_id) {
        console.log("Is there an ID? " + _id);

        // 1. Compile the template string into a functional engine
        const profileCompiled = Handlebars.compile(CTemplates.resumeList);

        // 2. Inject context data to generate the HTML string
        const renderedHtml = profileCompiled({
            title: "Resume Version List"
        });

        // 3. Render into the DOM
        _main.innerHTML = renderedHtml;
        const _html = await listGithubFolder('afiles');
        document.getElementById("resumes").querySelector('hr').insertAdjacentHTML("afterend", _html);

    }

}