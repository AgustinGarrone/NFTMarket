console.log("ANDA")
App= {
    contracts:{},
    init:async()=>{
        console.log("loaded");
        await App.loadMetamask()
        await App.loadAccount()
        await App.loadContracts()
        App.administrador=await App.color.verAdmin.call()
        await App.admin() 
        await App.cargarNFT()
    },
    loadMetamask: async ()=>{
        if (window.ethereum){
            App.web3Provider=window.ethereum;
            await window.ethereum.request({method:'eth_requestAccounts'})  //traemos las cuentas que conecta el usuario 
        } else if (window.web3) {  //SI NO TIENE METAMASK COMPRUEBA SI TIENE ALGUN PROOVEDOR DE WEB3
            web3=new Web3(window.web3.currentProvider)
        }
        else {
            alert("instala metamask");
        }
    },
    loadAccount:async()=> {  //Traemos las cuentas dfel usuario y guardamos la que usa en la variable App.account
        const accounts=await window.ethereum.request({method:'eth_requestAccounts'}) 
        App.account=accounts[0]; 
        console.log(App.account)
         document.querySelector(".nav__metamask--datatoken").innerHTML+=`
            <span>0</span>
            <img src="../img/token.png">
            <span>0</span>
            <img src="../img/coin.png" class="coin">
        ` 
    },
    loadContracts:async ()=> {
        const response=await fetch ("Color.json");
        const ColorJSON = await response.json()  //CARGAMOS LOS CONTRATOS
        App.contracts.Color=TruffleContract(ColorJSON) //Al objeto trufflecontract le damos el contract json nuestro. es como deployarlo
        App.contracts.Color.setProvider(App.web3Provider) //Conectamos nuestro contrato a metamask
        App.color=await App.contracts.Color.deployed()
         //deployamos y guardamos el contrato finalizado a utilizar en la propiedad App.tasksContract */
    },
    admin:async()=> { //PERMITIMOS AL ADMIN VER SU PANEL
        console.log("EL ADMIN ESTA")
        console.log(App.administrador)
        console.log(App.account)
        if (String(App.account).toUpperCase()==String(App.administrador).toUpperCase()) {
            let a=document.createElement("a")
            a.setAttribute('href', "admin.html");
            a.innerHTML=`Admin`
            a.classList.add("adminlink")
            document.querySelector(".nav__links").prepend(a)
        } else {
            console.log("no tas")
        }
    },
    hacer:async(name,meta,price)=>{
        const mintear=await App.color.mint(name,meta,price,{from:App.account})
    },
    cargarNFT:async()=>{
        console.log(App.color)
        const cantidadNFT=await App.color.getNFTSLength()
        const cantidadNFTS=cantidadNFT.toNumber()
        console.log(cantidadNFTS)
        document.querySelector(".accountAdd").innerHTML=`${App.account}`
        const contratoNFTT=await App.color.nftCONTRACT()
        console.log(contratoNFTT)

        if (cantidadNFTS>0) {
            for (let i=0;i<cantidadNFTS;i++) {
                const uri=await App.color.tokenURI(i+1)  //CARGAMOS LOS METADATOS DEL NFT EN UN JSON
                const responseURI=await fetch (uri);
                const uriJSON = await responseURI.json() 
                document.querySelector(".marketplace__nfts").innerHTML+=`
                    <div class="marketplace__nfts--card">
                        <h1>${uriJSON.name}</h1>
                        <img src="${uriJSON.image}" alt="">
                        <p>${uriJSON.description}</p>
                        <button id="buy" class"buynft">BUY</button>
                    </div>
            ` 
            }
            const buyButtons=document.querySelectorAll("#buy")
            console.log(buyButtons)
            const verprecio=await App.color.viewPrice(1,{from:App.account})
            console.log(verprecio.toNumber())
        } else {
            console.log("no")
        }
        const buyButtons=document.querySelectorAll("#buy")
        console.log(buyButtons[0])
        for (let i=0;i<buyButtons.length;i++) {
            const precio=await App.color.viewPrice(i+1,{from:App.account})
            console.log(precio.toNumber())
            const precioEthers=precio.toNumber()*1000000000000000000
            buyButtons[i].addEventListener("click",async()=>{
                const comprar=await App.color.purchase(i+1,{from:App.account,value:`${precioEthers}`})
            })
        }   
         /* for (button of buyButtons) {
            const precio=await App.color.viewPrice(1,{from:App.account})
            const precioEthers=precio.toNumber()*1000000000
            console.log(precioEthers)
            button.addEventListener("click",async()=>{
                const comprar=await App.color.purchase(button+1,{from:App.account,value:`${precio}`})
            })
        }    */
    },
    compraNFT:async function sendTransaction() {
           /*  const contrato= await App.color.nftCONTRACT()
            let params= [{
                "from": App.account,
                "to": contrato,
                "gas": Number(21000).toString(16), // 30400
                "gasPrice": Number(2500000).toString(16), // 10000000000000
                "value": Number(10000000000000000000).toString(16)
            }] */
       /*  let result=await window.ethereum.request({method:"eth_sendTransaction",params}).catch((err)=>{
            console.log(err)
        })  */

       /*  const comprar=await App.color.purchase(1,{from:App.account,value:'10000000000000000000'}) */
/*         const txHash = await ethereum.request({
            method: 'eth_sendTransaction',
            params,
            comprar
          });
 */

       
    }
}
App.init() 