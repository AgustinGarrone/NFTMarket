console.log("ANDA")
App= {
    contracts:{},
    init:async()=>{
        console.log("loaded");
        await App.loadMetamask()
        await App.loadAccount()
        await App.loadContracts()
        /* await App.createTask("#FFFFF") */
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
        App.admin() 
    },
    loadContracts:async ()=> {
        const response=await fetch ("Color.json");
        const ColorJSON = await response.json()  //CARGAMOS LOS CONTRATOS
        App.contracts.Color=TruffleContract(ColorJSON) //Al objeto trufflecontract le damos el contract json nuestro. es como deployarlo
        App.contracts.Color.setProvider(App.web3Provider) //Conectamos nuestro contrato a metamask
        App.color=await App.contracts.Color.deployed()
        App.ejecu()
         //deployamos y guardamos el contrato finalizado a utilizar en la propiedad App.tasksContract */
    },
    ejecu:async()=> {
        const ver=await App.color.name.call()
        console.log(ver) /* VER EL NOMBRE DEL COLOR*/
    },
    hacer:async(name,meta)=>{
        /* https://ipfs.io/ipfs/QmXbzqi2B7s1hrd89mxGo1MeYe8LatXzpBe1c5TsQV9uj2  METADATOS DEL TOKEN*/
           /* const hacerNFT2=await App.color.mint("BENDER",`https://ipfs.io/ipfs/QmQuSmG17mGasvvXvY4TCsH6DJujfKn4J12s81s4wt7Jtx?filename=metaColor.json`,{from:App.account})   */ 
        const mintear=await App.color.mint(name,meta,{from:App.account})
         const uri=await App.color.tokenURI(1)
         const responseURI=await fetch (uri);
        const uriJSON = await responseURI.json()  //CARGAMOS LOS METADATOS DEL NFT EN UN JSON
         console.log(uriJSON) 
         console.log(uriJSON.image)
         App.cargarNFT(uriJSON)
    },
    cargarNFT:async(meta)=>{
        let listaNFTS=await App.color.colors(0)
        document.querySelector(".marketplace__nfts").innerHTML+=`
        <div class="marketplace__nfts--card">
        <h1>${listaNFTS}</h1>
        <img src="${meta.image}" alt="">
        <p>${meta.description}</p>
    </div>
        ` 
    },
    mintNFT:async(clr)=>{
        const make=await App.color.mint(clr,{from:App.account}) 
        const verrr=await App.color.colors(3)
        console.log(verrr)
    },
    admin:async()=> { //PERMITIMOS AL ADMIN VER SU PANEL
        if (App.account=="0x0f22119ba5bfa747999a6716965adad4e1ed71bd") {
            let a=document.createElement("a")
            a.setAttribute('href', "admin.html");
            a.innerHTML=`Admin`
            a.classList.add("adminlink")
            document.querySelector(".nav__links").prepend(a)
        } else {
            console.log("no tas")
        }
    }
}
App.init()