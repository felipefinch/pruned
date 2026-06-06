// hbar_templates.js
export const HBar = {
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
            <li id="commit-history" class="navbar--item icon-link history">Commit History</li>
            <li id="raw-json" class="navbar--item icon-link json">Raw JSON</li>
            <li class="navbar--item icon-link branch">Branches</li>
        </ul>
    </navbar>
    `
};