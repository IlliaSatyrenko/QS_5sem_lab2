let reports = [];

async function loadReports() {
    const res = await fetch("data.json");
    reports = await res.json();
    renderReports(reports, "#reports-table tbody");
    fillFilterOptions();
}

function renderReports(data, selector) {
    const tbody = document.querySelector(selector);
    tbody.innerHTML = "";
    data.forEach((r) => {
        const row = `<tr>
      <td>${r.id}</td><td>${r.severity}</td><td>${r.status}</td>
      <td>${r.reporter}</td><td>${r.assignee}</td><td>${r.type}</td>
    </tr>`;
        tbody.innerHTML += row;
    });
}

document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-content").forEach((sec) => sec.classList.add("hidden"));
        document.getElementById(btn.dataset.tab).classList.remove("hidden");
    });
});

document.getElementById("open-signup").onclick = () => {
    document.getElementById("signup-modal").classList.remove("hidden");
};

document.getElementById("cancel-signup").onclick = () => {
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("confirm-password").value = "";
    document.getElementById("error-block").innerText = "";
    document.getElementById("signup-modal").classList.add("hidden");
};

document.getElementById("signup-form").onsubmit = (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirm = document.getElementById("confirm-password").value.trim();
    const error = document.getElementById("error-block");

    const userRegex = /^[A-Za-z][A-Za-z0-9_-]{2,20}$/;
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&+=]).{8,20}$/;

    if (!username) return (error.innerText = "Please enter the user name");
    if (!userRegex.test(username)) {
        return (error.innerText =
            "User Name must be defined with the following rules:\n- first character must be a letter\n- allowed: letters, numbers, _, -\n- length 3–20");
    }
    if (!password) return (error.innerText = "Please enter the password");
    if (!passRegex.test(password)) {
        return (error.innerText =
            "Password must be defined with the following rules:\n- length 8–20\n- must contain upper, lower, number, special !@#$%^&+=");
    }
    if (password !== confirm) return (error.innerText = "Password do not match");

    error.style.color = "green";
    error.innerText = "User account has been created successfully";
};

document.getElementById("password").onkeyup = () => {
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&+=]).{8,20}$/;

    const password = document.getElementById("password").value.trim();
    console.log(passRegex.test(password))

    if (passRegex.test(password)) {
        return document.getElementById("password-tooltip").innerText = "Password is valid"
    }
    else {
        return document.getElementById("password-tooltip").innerText = `Password must be defined with the following rules:
                        - password length must be between 8 to 20 inclusively characters
                        - password must contain number, at least one lower case letter, at least one upper case letter and at least one special character
                        - allowed special characters: !@#$%^&+=`
    }
};

document.getElementById("username").onkeyup = () => {
    const userRegex = /^[A-Za-z][A-Za-z0-9_-]{2,20}$/;

    const username = document.getElementById("username").value.trim();
    console.log(userRegex.test(username))

    if (userRegex.test(username)) {
        return document.getElementById("username-tooltip").innerText = "User Name is valid"
    }
    else {
        return document.getElementById("username-tooltip").innerText = `User Name must be defined with the following rules:
                        - the first character must be a letter
                        - it can contain letters, numbers, underscore, hyphen
                        - the length is between 3 to 20 inclusively
                        `
    }
};

document.getElementById("export-reports").onclick = () => {
    const msg = document.getElementById("export-msg");
    if (reports.length === 0) {
        msg.innerText = "There are no reports for exporting";
        return;
    }
    const csv = reports.map(
        (r) => `${r.id},${r.severity},${r.status},${r.reporter},${r.assignee},${r.type}`
    );
    const header = "ID,Severity,Status,Reporter,Assignee,Type\n";
    const blob = new Blob([header + csv.join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    const ts = new Date().toLocaleString("uk-UA").replace(/[/:]/g, ".").replace(", ", "_");
    a.href = URL.createObjectURL(blob);
    a.download = `ReportsInfo_${ts}.csv`;
    a.click();
    msg.innerText =
        reports.length === 1
            ? "Report has been exported successfully\nDirectory path: C:\\Reports_Export"
            : "Reports have been exported successfully\nDirectory path: C:\\Reports_Export";
};

document.querySelectorAll("input[name=mode]").forEach((radio) => {
    radio.onchange = () => {
        const filterBox = document.getElementById("filter-options");
        if (radio.value === "filter" && radio.checked) {
            filterBox.classList.remove("disabled");
            
            document.getElementById("chk-id").disabled = false;
            document.getElementById("chk-severity").disabled = false;
            document.getElementById("chk-status").disabled = false;
            document.getElementById("chk-reporter").disabled = false;
            document.getElementById("chk-assignee").disabled = false;
            document.getElementById("chk-type").disabled = false;
        } else {
            filterBox.classList.add("disabled");

            document.getElementById("chk-id").disabled = true;
            document.getElementById("chk-severity").disabled = true;
            document.getElementById("chk-status").disabled = true;
            document.getElementById("chk-reporter").disabled = true;
            document.getElementById("chk-assignee").disabled = true;
            document.getElementById("chk-type").disabled = true;
        }
    };
});

["id", "severity", "status", "reporter", "assignee", "type"].forEach((f) => {
    document.getElementById("chk-" + f).onchange = (e) => {
        document.getElementById("filter-" + f).disabled = !e.target.checked;
    };
});

function fillFilterOptions() {
    function fill(id, values) {
        const sel = document.getElementById("filter-" + id);
        sel.innerHTML = "<option value=''>--вибрати--</option>";
        [...new Set(values)].forEach((v) => {
            sel.innerHTML += `<option>${v}</option>`;
        });
    }
    fill(
        "id",
        reports.map((r) => r.id)
    );
    fill(
        "severity",
        reports.map((r) => r.severity)
    );
    fill(
        "status",
        reports.map((r) => r.status)
    );
    fill(
        "reporter",
        reports.map((r) => r.reporter)
    );
    fill(
        "assignee",
        reports.map((r) => r.assignee)
    );
    fill(
        "type",
        reports.map((r) => r.type)
    );
}

document.getElementById("find-report").onclick = () => {
    const mode = document.querySelector("input[name=mode]:checked").value;
    const msg = document.getElementById("filter-msg");
    msg.innerText = "";
    if (mode === "simple") {
        if (reports.length === 0) {
            msg.innerText = "There is no reports";
        } else {
            renderReports(reports, "#filter-results tbody");
        }
        return;
    }

    let data = reports.slice();
    const fields = ["id", "severity", "status", "reporter", "assignee", "type"];
    for (let f of fields) {
        if (document.getElementById("chk-" + f).checked) {
            const val = document.getElementById("filter-" + f).value;
            if (!val) {
                msg.innerText = f.charAt(0).toUpperCase() + f.slice(1) + " is not defined";
                return;
            }
            data = data.filter((r) => r[f] == val);
        }
    }

    if (data.length === 0) {
        msg.innerText = "No Reports were found to match your search";
    }
    renderReports(data, "#filter-results tbody");
};

loadReports();
