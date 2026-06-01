// hbar_templates.js
export const HBar = {
    userProfile: `
    <div class="profile">
      <h2>{{name}}</h2>
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
    `
};