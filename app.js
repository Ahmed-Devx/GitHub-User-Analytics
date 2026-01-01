const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("search");
const showBtn = document.querySelector(".showBtn");
const repoCards = document.querySelector("#repo-cards");

searchBtn.addEventListener("click", fetchUser);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") fetchUser();
});

async function fetchUser() {
  const user = searchInput.value.trim();

  if (!user) {
    Swal.fire({
      icon: "warning",
      title: "Oops...",
      text: "Please enter your Github User-name!",
      confirmButtonColor: "#0dcaf0",
    });
    return;
  }

  try {
    const resUser = await fetch(`https://api.github.com/users/${user}`);
    if (resUser.status === 404) {
      Swal.fire({
        icon: "error",
        title: "User not found",
        text: "Please enter a valid User-name!",
        confirmButtonColor: "#0dcaf0",
      });
      return;
    }

    const dataUser = await resUser.json();

    document.querySelector(".profile-image-container img").src =
      dataUser.avatar_url || "default-avatar.png";
    document.querySelector(".glass-card h3").textContent =
      dataUser.name || "No Name";
    document.querySelector("#user-name").textContent = dataUser.login || "";
    document.querySelector(".bio").textContent = dataUser.bio || "No Bio";
    document.querySelector(".Followers").textContent = dataUser.followers || 0;
    document.querySelector(".Following").textContent = dataUser.following || 0;
    document.querySelector(".Repos").textContent = dataUser.public_repos || 0;
    document.querySelector(
      "#location"
    ).innerHTML = `<i class="fas fa-location-dot me-1 text-white"></i> ${
      dataUser.location || "Not specified"
    }`;
    function formatDate(dateString) {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    document.querySelector(
      "#joining"
    ).innerHTML = `<i class="fa-solid fa-face-smile me-1 text-white"></i> Joined ${formatDate(
      dataUser.created_at
    )}`;

    const resRepos = await fetch(`https://api.github.com/users/${user}/repos`);
    const dataRepos = await resRepos.json();

    let totalStars = 0;
    let totalForks = 0;
    let totalWatchers = 0;

    dataRepos.forEach((repo) => {
      totalStars += repo.stargazers_count;
      totalForks += repo.forks_count;
      totalWatchers += repo.watchers_count;
    });

    document.getElementById("totalStars").textContent = totalStars;
    document.getElementById("totalForks").textContent = totalForks;
    document.getElementById("totalWatchers").textContent = totalWatchers;

    repoCards.innerHTML = "";
    dataRepos.slice(0, 6).forEach((repo) => {
      repoCards.innerHTML += `
        <div class="col-md-6">
          <div class="list-card h-100">
            <a href="${repo.html_url}" class="repo-title">${repo.name}</a>
            <p class="text-white small mt-2">
              ${repo.description || "No description provided"}
            </p>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <span class="badge-tech"><i class="fa-solid fa-code me-1"></i>${
                repo.language || "N/A"
              }</span>
              <span class="badge-tech"><i class="fa-solid fa-star me-1"></i>${
                repo.stargazers_count
              }</span>
              <span class="badge-tech"><i class="fa-solid fa-eye me-1"></i>${
                repo.watchers_count
              }</span>
              <span class="badge-tech"><i class="fa-solid fa-code-fork me-1"></i>${
                repo.forks_count
              }</span>
            </div>
          </div>
        </div>
      `;
    });

    if (dataRepos.length > 6) {
      showBtn.style.display = "block";
      showBtn.onclick = () => {
        showBtn.style.display = "none";
        dataRepos.slice(6, 12).forEach((repo) => {
          repoCards.innerHTML += `
            <div class="col-md-6">
              <div class="list-card h-100">
                <a href="${repo.html_url}" class="repo-title">${repo.name}</a>
                <p class="text-white small mt-2">
                  ${repo.description || "No description provided"}
                </p>
                <div class="d-flex justify-content-between align-items-center mt-3">
                  <span class="badge-tech"><i class="fa-solid fa-code me-1"></i>${
                    repo.language || "N/A"
                  }</span>
                  <span class="badge-tech"><i class="fa-solid fa-star me-1"></i>${
                    repo.stargazers_count
                  }</span>
                  <span class="badge-tech"><i class="fa-solid fa-eye me-1"></i>${
                    repo.watchers_count
                  }</span>
                  <span class="badge-tech"><i class="fa-solid fa-code-fork me-1"></i>${
                    repo.forks_count
                  }</span>
                </div>
              </div>
            </div>
          `;
        });
      };
    } else {
      showBtn.style.display = "none";
    }
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong. Try again later!",
      confirmButtonColor: "#0dcaf0",
    });
  }
}
