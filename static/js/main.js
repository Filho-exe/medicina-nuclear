const form = document.getElementById('mainForm');
const input = document.getElementById('radiofarmaco');
const info = document.getElementById('info');
const div = document.querySelector('.preview')
const container = document.querySelector('.container')

document.getElementById('limpar').addEventListener('click', () => {
    form.reset();
    div.classList.remove("esquerda")
    container.classList.remove("return")
    info.style.opacity = "0%"

});

document.getElementById('submit').addEventListener('click', () => {
    const inputs = document.querySelectorAll('input')
    let vazio = false
    inputs.forEach(input => {
        if (input.value.trim() === '') vazio = true
    });
    if (!vazio) {
        container.classList.add('out')
        info.style.opacity = '0%'
        container.style.opacity = '0%'
    }

})

input.addEventListener('input', function () {
    console.log(this.value)

    if (this.value === "Tecnécio-99m") {
        //console.log('Tecnecio99m');
        document.getElementById("radioisotopo").innerHTML = "<sup>99m</sup>Tc -> Tecnécio-99m ";
        document.getElementById("meia-vida").textContent = "6,006h"
        document.getElementById("massa").textContent = "98.9063 u"
        document.getElementById("decaimento").textContent = "(γ)"
        document.getElementById("eliminacao").textContent = "Urinário"
        info.style.opacity = "100%";
        div.classList.add("esquerda")
        container.classList.add("return")

    } else {
        if (this.value === "Iodo-131") {
            console.log("Iodo")
            document.getElementById("radioisotopo").innerHTML = "<sup>131</sup>I -> Iodo 131";
            document.getElementById("meia-vida").textContent = "8 dias"
            document.getElementById("massa").textContent = "130,9061 u"
            document.getElementById("decaimento").textContent = "(β⁻,γ)"
            document.getElementById("eliminacao").textContent = "Urinário"
            info.style.opacity = "100%";
            div.classList.add("esquerda")
            container.classList.add("return")
        } else {
            if (this.value === "Rubídio-82") {
                console.log('Rubio-82')
                document.getElementById("radioisotopo").innerHTML = "<sup>82</sup>Rb -> Rubídio 82 ";
                document.getElementById("meia-vida").textContent = "75 segundos"
                document.getElementById("massa").textContent = "81,9182 u"
                document.getElementById("decaimento").textContent = "(β⁻,C.E)"
                document.getElementById("eliminacao").textContent = "Não se acumula"
                info.style.opacity = "100%";
                div.classList.add("esquerda")
                container.classList.add("return")
            }
        }
    }
})
