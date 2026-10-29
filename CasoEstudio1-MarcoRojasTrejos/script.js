"use strict";

const students = [
  { firstName: "Maria", lastName: "Mora Perez", grade: 90 },
  { firstName: "Pedro", lastName: "Sibaja Lopez", grade: 60 },
  { firstName: "Marco", lastName: "Rojas Castro", grade: 78 },
];

const studentForm = document.querySelector("#student-form");
const firstNameInput = document.querySelector("#first-name");
const lastNameInput = document.querySelector("#last-name");
const gradeInput = document.querySelector("#grade");
const tableBody = document.querySelector("#student-table-body");
const studentCount = document.querySelector("#student-count");
const errorMessage = document.querySelector("#form-error");
const successMessage = document.querySelector("#form-success");

const highestGradeElement = document.querySelector("#highest-grade");
const highestStudentElement = document.querySelector("#highest-student");
const averageGradeElement = document.querySelector("#average-grade");
const lowestGradeElement = document.querySelector("#lowest-grade");
const lowestStudentElement = document.querySelector("#lowest-student");

function getGradeClass(grade) {
  if (grade >= 80) {
    return "grade grade-high";
  }

  if (grade < 65) {
    return "grade grade-low";
  }

  return "grade grade-regular";
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.hidden = false;
  successMessage.textContent = "";
  successMessage.hidden = true;
}

function showSuccess(message) {
  successMessage.textContent = message;
  successMessage.hidden = false;
  errorMessage.textContent = "";
  errorMessage.hidden = true;
}

function clearFieldErrors() {
  [firstNameInput, lastNameInput, gradeInput].forEach((input) => {
    input.removeAttribute("aria-invalid");
  });
}

function markInvalidFields() {
  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const gradeText = gradeInput.value.trim();

  firstNameInput.setAttribute("aria-invalid", String(firstName === ""));
  lastNameInput.setAttribute("aria-invalid", String(lastName === ""));
  gradeInput.setAttribute(
    "aria-invalid",
    String(
      gradeText === "" ||
        !Number.isFinite(Number(gradeText)) ||
        Number(gradeText) < 0 ||
        Number(gradeText) > 100,
    ),
  );
}

function renderStudents() {
  tableBody.replaceChildren();

  students.forEach((student, index) => {
    const row = document.createElement("tr");

    const numberCell = document.createElement("td");
    numberCell.textContent = String(index + 1);

    const firstNameCell = document.createElement("td");
    firstNameCell.textContent = student.firstName;

    const lastNameCell = document.createElement("td");
    lastNameCell.textContent = student.lastName;

    const gradeCell = document.createElement("td");
    const gradeBadge = document.createElement("span");
    gradeBadge.className = getGradeClass(student.grade);
    gradeBadge.textContent = formatGrade(student.grade);
    gradeCell.appendChild(gradeBadge);

    row.append(numberCell, firstNameCell, lastNameCell, gradeCell);
    tableBody.appendChild(row);
  });

  const count = students.length;
  studentCount.textContent = `${count} ${count === 1 ? "estudiante" : "estudiantes"}`;
}

function formatGrade(grade) {
  return Number.isInteger(grade)
    ? String(grade)
    : String(Number(grade.toFixed(2)));
}

function getStudentNamesByGrade(targetGrade) {
  return students
    .filter((student) => student.grade === targetGrade)
    .map((student) => `${student.firstName} ${student.lastName}`)
    .join(", ");
}

function updateSummary() {
  if (students.length === 0) {
    highestGradeElement.textContent = "—";
    highestStudentElement.textContent = "Sin estudiantes registrados";
    averageGradeElement.textContent = "—";
    lowestGradeElement.textContent = "—";
    lowestStudentElement.textContent = "Sin estudiantes registrados";
    return;
  }

  const grades = students.map((student) => student.grade);
  const highestGrade = Math.max(...grades);
  const lowestGrade = Math.min(...grades);
  const total = grades.reduce((sum, grade) => sum + grade, 0);
  const average = total / students.length;

  highestGradeElement.textContent = formatGrade(highestGrade);
  highestStudentElement.textContent = getStudentNamesByGrade(highestGrade);
  averageGradeElement.textContent = average.toFixed(2);
  lowestGradeElement.textContent = formatGrade(lowestGrade);
  lowestStudentElement.textContent = getStudentNamesByGrade(lowestGrade);
}

studentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearFieldErrors();

  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const gradeText = gradeInput.value.trim();

  if (firstName === "" || lastName === "" || gradeText === "") {
    markInvalidFields();
    showError(
      "Todos los campos son obligatorios. Completa el nombre, los apellidos y la nota.",
    );
    return;
  }

  const grade = Number(gradeText);

  if (!Number.isFinite(grade) || grade < 0 || grade > 100) {
    gradeInput.setAttribute("aria-invalid", "true");
    showError("La nota debe ser un número entre 0 y 100.");
    gradeInput.focus();
    return;
  }

  students.push({ firstName, lastName, grade });

  renderStudents();
  updateSummary();

  studentForm.reset();
  clearFieldErrors();
  showSuccess(`Estudiante ${firstName} ${lastName} agregado correctamente.`);
  firstNameInput.focus();
});

[firstNameInput, lastNameInput, gradeInput].forEach((input) => {
  input.addEventListener("input", () => {
    input.removeAttribute("aria-invalid");

    if (!errorMessage.hidden) {
      errorMessage.textContent = "";
      errorMessage.hidden = true;
    }
  });
});

renderStudents();
updateSummary();
