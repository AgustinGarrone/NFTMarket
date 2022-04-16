
/* const input=document.querySelector("#taskForm")

console.log(input)
input.addEventListener("submit",e=>{
    e.preventDefault()
    App.mintNFT(input["valor"].value)
})

 */
const input=document.querySelector("#taskForm")
const send=document.getElementById("submitNFT")
send.addEventListener("click",()=>{
    App.hacer(input["nombre"].value,input["meta"].value,input["price"].value)
})