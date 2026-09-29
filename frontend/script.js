const API_URL = "/candidates";


// API helper
async function apiRequest(url, options = {}) {
    const response = await fetch(url, options);

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
        throw new Error(data.detail || "Something went wrong");
    }

    return data;
}


// Register candidate
document.getElementById("candidateForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const candidate = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        role: document.getElementById("role").value,
        status: document.getElementById("status").value,
        skills: document.getElementById("skills").value.trim(),
        experience: Number(document.getElementById("experience").value)
    };

    const message = document.getElementById("message");

    if (!/^\d{10}$/.test(candidate.phone)) {
        message.textContent = "Mobile number must contain exactly 10 digits.";
        return;
    }

    try {
        await apiRequest(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(candidate)
        });

        message.textContent = "Candidate registered successfully.";
        this.reset();

        loadCandidates();

    } catch (error) {
        message.textContent = error.message;
    }
});


// Load candidates
async function loadCandidates() {

    const params = new URLSearchParams();

    const search = document.getElementById("search").value.trim();
    const role = document.getElementById("filterRole").value;
    const status = document.getElementById("filterStatus").value;

    if (search) params.append("search", search);
    if (role) params.append("role", role);
    if (status) params.append("status", status);

    const url = params.toString()
        ? `${API_URL}?${params}`
        : API_URL;

    try {
        const candidates = await apiRequest(url);
        displayCandidates(candidates);

    } catch (error) {
        document.getElementById("candidateTable").innerHTML =
            `<tr><td colspan="6">${error.message}</td></tr>`;
    }
}


// Display candidates
function displayCandidates(candidates) {

    const table = document.getElementById("candidateTable");

    if (!candidates.length) {
        table.innerHTML =
            `<tr><td colspan="6">No candidates found.</td></tr>`;
        return;
    }

    table.innerHTML = candidates.map(candidate => `
        <tr>
            <td>${candidate.name}</td>
            <td>${candidate.email}</td>
            <td>${candidate.phone}</td>
            <td>${candidate.role}</td>
            <td>${candidate.status}</td>
            <td>
                <button onclick="viewCandidate(${candidate.id})">View</button>
                <button onclick="updateCandidate(${candidate.id})">Edit</button>
                <button onclick="deleteCandidate(${candidate.id})">Delete</button>
            </td>
        </tr>
    `).join("");
}


// View candidate
async function viewCandidate(id) {

    try {
        const candidate = await apiRequest(`${API_URL}/${id}`);

        document.getElementById("viewDetails").innerHTML = `
            <p><strong>Name:</strong> ${candidate.name}</p>
            <p><strong>Email:</strong> ${candidate.email}</p>
            <p><strong>Phone:</strong> ${candidate.phone}</p>
            <p><strong>Role:</strong> ${candidate.role}</p>
            <p><strong>Status:</strong> ${candidate.status}</p>
            <p><strong>Skills:</strong> ${candidate.skills || "N/A"}</p>
            <p><strong>Experience:</strong> ${candidate.experience} years</p>
        `;

        document.getElementById("viewSection").style.display = "block";

        window.scrollTo({
            top: document.getElementById("viewSection").offsetTop,
            behavior: "smooth"
        });

    } catch (error) {
        alert(error.message);
    }
}

function closeView() {
    document.getElementById("viewSection").style.display = "none";
    document.getElementById("copyMessage").textContent = "";
}



// Open edit form
async function updateCandidate(id) {

    try {
        const candidate = await apiRequest(`${API_URL}/${id}`);

        document.getElementById("editId").value = candidate.id;
        document.getElementById("editName").value = candidate.name;
        document.getElementById("editEmail").value = candidate.email;
        document.getElementById("editPhone").value = candidate.phone;
        document.getElementById("editRole").value = candidate.role;
        document.getElementById("editStatus").value = candidate.status;
        document.getElementById("editSkills").value = candidate.skills || "";
        document.getElementById("editExperience").value = candidate.experience;

        document.getElementById("editSection").style.display = "block";

        window.scrollTo({
            top: document.getElementById("editSection").offsetTop,
            behavior: "smooth"
        });

    } catch (error) {
        alert(error.message);
    }
}


// Save edited candidate
document.getElementById("editForm").addEventListener("submit", async function (event) {

    event.preventDefault();

    const id = document.getElementById("editId").value;

    const candidate = {
        name: document.getElementById("editName").value.trim(),
        email: document.getElementById("editEmail").value.trim(),
        phone: document.getElementById("editPhone").value.trim(),
        role: document.getElementById("editRole").value,
        status: document.getElementById("editStatus").value,
        skills: document.getElementById("editSkills").value.trim(),
        experience: Number(document.getElementById("editExperience").value)
    };

    const message = document.getElementById("editMessage");

    if (!/^\d{10}$/.test(candidate.phone)) {
        message.textContent = "Mobile number must contain exactly 10 digits.";
        return;
    }

    try {
        await apiRequest(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(candidate)
        });

        message.textContent = "Candidate updated successfully.";

        loadCandidates();

        setTimeout(closeEdit, 700);

    } catch (error) {
        message.textContent = error.message;
    }
});


// Close edit form
function closeEdit() {
    document.getElementById("editSection").style.display = "none";
    document.getElementById("editForm").reset();
    document.getElementById("editMessage").textContent = "";
}


// Delete candidate
async function deleteCandidate(id) {

    if (!confirm("Are you sure you want to delete this candidate?")) {
        return;
    }

    try {
        const data = await apiRequest(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        alert(data.message || "Candidate deleted successfully.");

        loadCandidates();

    } catch (error) {
        alert(error.message);
    }
}


// Load candidates when page opens
loadCandidates();