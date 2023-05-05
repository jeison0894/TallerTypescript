"use strict";
const SELECTOR_MODAL = ".modal";
const SELECTOR_MODAL_FORM = ".modal__form";
const SELECTOR_ADD_STUDENT_BTN = ".addStudentBtn";
const SELECTOR_TIPO_IDENTIFICACION = "#tipoIdentificacion";
const MESSAGE_ONLY_NUMBERS = "Solo se permiten números entre 1 y 3";
class StudentAPI {
    constructor() {
        this.url = "https://apiestudiantes.maosystems.dev/estudiantes";
        this.headers = {
            "Content-Type": "application/json",
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWNhY2lvbiI6MSwiY29ycmVvIjoidXNlcjEiLCJpYXQiOjE2ODI4MTEzODQsImV4cCI6MTY4MzQxNjE4NH0.a9TvrAbBSsfPDbZXibv2SgdUSpNY5FppWDklUHSpxV8",
        };
        this.modal = document.querySelector(SELECTOR_MODAL);
    }
    getStudents() {
        fetch(this.url, { headers: this.headers })
            .then((response) => response.json())
            .then((data) => this.renderStudents(data))
            .catch((error) => console.log(error));
    }
    renderStudents(students) {
        const database = students.data;
        const tbody = document.querySelector("tbody");
        if (tbody) {
            tbody.innerHTML = "";
            database.forEach((student) => {
                tbody.innerHTML += `
              <tr>
                <td>${student.estudiante_id}</td>
                <td>${student.estudiante_nombres}</td>
                <td>${student.estudiante_apellidos}</td>
                <td>${student.estudiante_celular}</td>
                <td>${student.estudiante_correo}</td>
                <td>${student.estudiante_linkedin}</td>
                <td>${student.estudiante_github}</td>
                <td><button class="edit">Editar</button></td>
              </tr>`;
            });
        }
    }
    addStudent(data) {
        try {
            fetch(this.url, {
                method: "POST",
                headers: this.headers,
                body: JSON.stringify(data),
            })
                .then((response) => {
                if (response.status === 409)
                    throw alert(`El estudiante ya existe - ${response.status}`);
                if (response.status === 400)
                    throw alert(`Error creando el estudiante,  verifique los datos - ${response.status}`);
            })
                .then(() => {
                alert("Estudiante agregado correctamente");
                this.getStudents();
                this.closeModal();
            });
        }
        catch (error) {
            console.log(error);
        }
    }
    editStudent() {
        document.addEventListener("click", (event) => {
            if (event.target.classList.contains("edit")) {
                const row = event.target.closest("tr");
                if (row) {
                    const data = this.extractStudentDataFromRow(row);
                    this.fillFormWithData(data);
                    this.openModal();
                }
            }
        });
    }
    extractStudentDataFromRow(row) {
        const estudianteId = row.querySelector("td");
        const estudianteNombres = row.querySelector("td:nth-child(2)");
        const estudianteApellidos = row.querySelector("td:nth-child(3)");
        const estudianteCelular = row.querySelector("td:nth-child(4)");
        const estudianteCorreo = row.querySelector("td:nth-child(5)");
        const estudianteLinkedin = row.querySelector("td:nth-child(6)");
        const estudianteGithub = row.querySelector("td:nth-child(7)");
        const data = {
            identificador: estudianteId ? Number(estudianteId.textContent) || 0 : 0,
            nombres: estudianteNombres ? estudianteNombres.textContent || "" : "",
            apellidos: estudianteApellidos
                ? estudianteApellidos.textContent || ""
                : "",
            celular: estudianteCelular
                ? Number(estudianteCelular.textContent) || 0
                : 0,
            correo: estudianteCorreo ? estudianteCorreo.textContent || "" : "",
            linkedin: estudianteLinkedin ? estudianteLinkedin.textContent || "" : "",
            github: estudianteGithub ? estudianteGithub.textContent || "" : "",
        };
        return data;
    }
    fillFormWithData(data) {
        const form = document.querySelector(SELECTOR_MODAL_FORM);
        if (form) {
            form.querySelector("h4").textContent = "Editar Estudiante";
            form.tipoIdentificacion.value = 0;
            form.numeroIdentificacion.disabled = true;
            form.identificador.value = data.identificador;
            form.nombres.value = data.nombres;
            form.apellidos.value = data.apellidos;
            form.celular.value = String(data.celular);
            form.correo.value = data.correo;
            form.linkedin.value = data.linkedin;
            form.github.value = data.github;
        }
    }
    updateStudent(data, id) {
        try {
            fetch(`${this.url}/${id}`, {
                method: "PUT",
                headers: this.headers,
                body: JSON.stringify(data),
            })
                .then((response) => {
                if (response.status === 400)
                    throw alert(`Error actualizando el estudiante, verifique los datos - ${response.status}`);
            })
                .then(() => {
                alert("Estudiante actualizado correctamente");
                this.getStudents();
                this.closeModal();
            });
        }
        catch (error) {
            console.log(error);
        }
    }
    openModal() {
        if (this.modal) {
            this.modal.showModal();
            this.modal.classList.add("active");
        }
    }
    closeModal() {
        if (this.modal) {
            this.modal.classList.remove("active");
            this.modal.close();
        }
    }
    init() {
        var _a;
        const addStudent = document.querySelector(SELECTOR_ADD_STUDENT_BTN);
        const form = document.querySelector(SELECTOR_MODAL_FORM);
        const tipoIdentificacionInput = document.querySelector(SELECTOR_TIPO_IDENTIFICACION);
        this.getStudents();
        this.editStudent();
        (_a = this.modal) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => this.closeModal());
        form.addEventListener("click", (event) => event.stopPropagation());
        addStudent.addEventListener("click", () => {
            form.querySelector("h4").textContent =
                "Agregar Estudiante";
            form.numeroIdentificacion.disabled = false;
            form.reset();
            this.openModal();
        });
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const data = {
                tipoIdentificacion: Number(form.tipoIdentificacion.value),
                numeroIdentificacion: Number(form.numeroIdentificacion.value),
                identificador: Number(form.identificador.value),
                nombres: form.nombres.value,
                apellidos: form.apellidos.value,
                celular: Number(form.celular.value),
                correo: form.correo.value,
                linkedin: form.linkedin.value,
                github: form.github.value,
            };
            if (data.identificador) {
                const editData = data;
                this.updateStudent(editData, Number(editData.identificador));
            }
            else {
                const newStudentData = data;
                this.addStudent(newStudentData);
            }
        });
        tipoIdentificacionInput.addEventListener("input", () => {
            const value = parseInt(tipoIdentificacionInput.value);
            if (value === 0 || value > 3) {
                tipoIdentificacionInput.value = "";
                alert("Solo se permiten números entre 1 y 3");
            }
        });
    }
}
const api = new StudentAPI();
api.init();
