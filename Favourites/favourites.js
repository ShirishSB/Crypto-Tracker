const tableBody = document.querySelector("#table-header tbody");
const loader = document.querySelector(".loader");

const BASE_URL=`https://api.coingecko.com/api`;
const options ={
    method:"GET",
    headers: {
        accept:"application/json",
        "x-cg-demo-api-key": "CG-tdE4YDbcS8ssweWRTVQbSSCk",
    },

};


const getFavCoins = () => {
    return JSON.parse(localStorage.getItem("favCoins")) || [];
}




const fetchFavCoins =async (coinIds)=>{
    try{
    showLoader();
    const response = await fetch(`${BASE_URL}/v3/coins/markets?vs_currency=usd&ids=${coinIds.join(",")}`,options);
    const data = await response.json();
    hideLoader();
    return data;
    }
    catch(err){
        console.log(err);
    }

}



const renderCoins = (coinsToDisplay)=>{
    tableBody.innerHTML ="";
    coinsToDisplay.forEach((coin,index) => {
       const row = document.createElement("tr");
        row.innerHTML = `                    
                    <td>${index+1}</td>
                    <td><img src="${coin.image} alt=${coin.name}" style = "width:24px;height=24px"></td>
                    <td>${coin.name}</td>
                    <td>$${coin.current_price.toLocaleString()}</td>
                    <td>$${coin.total_volume.toLocaleString()}</td>
                    <td>$${coin.market_cap.toLocaleString()}</td>
                    `;
                    row.addEventListener("click",(e)=>{
                        window.location.href = `/coin/coin.html?id=${coin.id}`;
                    });

                    tableBody.appendChild(row);
    });
};


const showLoader = () =>{
    loader.style.display = "block";

}

const hideLoader =()=>{
    loader.style.display = "none";
}


window.onload = async ()=>{
    const favCoins = getFavCoins();
    const feCoins = await fetchFavCoins(favCoins);
    console.log(feCoins);
    renderCoins(feCoins);

}