const deleteUser = document.querySelectorAll(".deleteUser");


deleteUser.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        const userId = e.target.dataset.userId;
        async function deleteUser() {
            const response = await fetch(`/api/users/deleteuser/${userId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            if (response.ok) {
                swal("¡Eliminación Exitosa!", "El usuario ha sido eliminado con éxito.", "success");
                setTimeout(function () {
                    location.reload();
                }, 2000);
            } else {
                swal("Error", "Hubo un problema al eliminar el usuario.", "error");
            }
        }
        deleteUser()
    });
});







deleteUser.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        const userId = e.target.dataset.userId;
        async function deleteUser() {
            const response = await fetch(`/api/users/deleteuser/${userId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            if (response.ok) {
                swal("¡Eliminación Exitosa!", "El usuario ha sido eliminado con éxito.", "success");
                setTimeout(function () {
                    location.reload();
                }, 2000);
            } else {
                swal("Error", "Hubo un problema al eliminar el usuario.", "error");
            }
        }
        deleteUser()
    });
});


const updUser = document.querySelectorAll(".updUser");

updUser.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        const userId = e.target.dataset.userId;
        async function deleteUser() {
            const response = await fetch(`/api/users/updateRolAdmin/${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            if (response.ok) {
                swal("¡Cambio de rol Exitoso !", "El usuario ha sido cambido de rol con éxito.", "success");
                setTimeout(function () {
                    location.reload();
                }, 2000);
            } else {
                swal("Error", "Hubo un problema al cambiar el rol.", "error");
            }
        }
        deleteUser()
    });
});