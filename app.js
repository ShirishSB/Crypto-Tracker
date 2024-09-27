// call an API to fetch the list of crypto coins
const loader = document.querySelector(".loader");
const nextButton = document.getElementById("next-button");
const prevButton = document.getElementById("prev-button");
const PaginationControl = document.getElementById("pagination-control");
const sortPriceAsc = document.getElementById("sort-price-asc");
const sortPriceDesc = document.getElementById("sort-price-desc");
const sortVolumeAsc = document.getElementById("sort-volume-asc");
const sortVolumeDesc = document.getElementById("sort-volume-desc");
const sortMarketCapAsc = document.getElementById("sort-market-cap-asc");
const sortMarketCapDesc = document.getElementById("sort-market-cap-desc");
let currentPage =1;
const ItemsPerPage = 10;
const tableBody = document.querySelector("#table-header tbody");

const BASE_URL=`https://api.coingecko.com/api`;
let coins =[];
const options ={
    method:"GET",
    headers: {
        accept:"application/json",
        "x-cg-demo-api-key": "CG-tdE4YDbcS8ssweWRTVQbSSCk",
    },

};
const fetchCoins = async(page = 1)=>{
    try{
    showLoader();
    const response = await fetch(`${BASE_URL}/v3/coins/markets?vs_currency=usd&per_page=10&page=${page}`,options);
    coins = await response.json();
    return coins;
    }catch(err){
        console.log(err);
    }
    finally{
        hideLoader();
    }
}
// rendering coins on UI
const renderCoins = (coinsToDisplay,currentPage)=>{
    tableBody.innerHTML ="";
    const favCoins = getFavCoin();
    const start = (currentPage-1)*ItemsPerPage+1;
    console.log(coinsToDisplay);
    coinsToDisplay.forEach((coin,index) => {
       const row = document.createElement("tr");
       const isFavCoins = favCoins.includes(coin.id);
        row.innerHTML = `                    
                    <td>${start+index}</td>
                    <td><img src="${coin.image} alt=${coin.name}" style = "width:24px;height=24px"></td>
                    <td>${coin.name}</td>
                    <td>$${coin.current_price.toLocaleString()}</td>
                    <td>$${coin.total_volume.toLocaleString()}</td>
                    <td>$${coin.market_cap.toLocaleString()}</td>
                    <td><i class="fa-solid fa-star ${isFavCoins ? "favorite" : ""}" id="favorite-icon"></i></td>
                    `;
                    row.addEventListener("click",(e)=>{
                        window.location.href = `/coin/coin.html?id=${coin.id}`;
                    });

                    row.querySelector("#favorite-icon").addEventListener("click",(e)=>{
                        e.stopPropagation();
                        handleClickFavorite(coin.id);
                    });

                    tableBody.appendChild(row);
    })
};
const saveFavoriteIcon = (favorites)=>{
    localStorage.setItem("favCoins",JSON.stringify(favorites));

}

const getFavCoin=()=>JSON.parse(localStorage.getItem("favCoins")) || [];

const toggleFavoriteIcon=(coinId)=>{
    let favCoins = getFavCoin();
    if(favCoins.includes(coinId)){
        favCoins = favCoins.filter((id)=>id!==coinId);
    }
    else{
        favCoins.push(coinId);
    }

    return favCoins;
    
}

const handleClickFavorite =(coinId)=>{
    let favCoins = toggleFavoriteIcon(coinId);
    saveFavoriteIcon(favCoins);
    renderCoins(coins,currentPage);

}
const fetchSearchById =async (coinIds)=>{
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
const SearchBox = document.getElementById("search-box");
const fetchSearchResults = async(query)=>{
    try{
        showLoader();
        const response = await fetch(`${BASE_URL}/v3/search?query=${query}`, options);
        const data = await response.json();
        const filteredData = data.coins.map((coin)=>coin.id);
        const fetchedData = await fetchSearchById(filteredData);
        return fetchedData;
    }
    catch(err){
        console.log(err);
        hideLoader();
    }
}

const handleSearchInput =async (e)=>{
    let SearchQuery = e.target.value;
    if(SearchQuery.length>1){
        try{
        showLoader();
        const coinsData = await fetchSearchResults(SearchQuery);
        renderCoins(coinsData,1);
        prevButton.style.display = "none";
        nextButton.style.display="none";
        }
        catch(err){
            console.log(err);
        }
        finally{
            hideLoader();
        }
        //updatePaginationControl();
    }
};
SearchBox.addEventListener("input",handleSearchInput);
const updatePaginationControl=()=>{
    if(currentPage===1){
        prevButton.disabled = true;
        prevButton.style.backgroundColor = "#ddd";
        prevButton.classList.add("disabled");
    }
    else{
        prevButton.disabled = false;
        prevButton.style.backgroundColor ="gold";
        prevButton.classList.remove("disabled");
    }
    if(currentPage === 10){
        nextButton.disabled= true;
        nextButton.style.backgroundColor ="#ddd";
        nextButton.classList.add("disabled");
    }
    else{
        nextButton.disabled= false;
        nextButton.classList.remove("disabled");
    }
}

const handleNextClick=async()=>{
    currentPage++;
    await fetchCoins(currentPage);
    renderCoins(coins,currentPage);
    updatePaginationControl();
}

const handlePrevClick=async()=>{
    if(currentPage>1){
        currentPage--;
        await fetchCoins(currentPage);
        renderCoins(coins,currentPage);
        updatePaginationControl();
    }
}
const sortCoinsByPriceAsc = () => {
    coins.sort(function (a,b){
        return a.current_price - b.current_price;
    });
    renderCoins(coins, currentPage);
  };

const sortCoinsByPriceDesc = () => {
    coins.sort((a,b)=>{
        return b.current_price - a.current_price;
    });
    renderCoins(coins, currentPage);
  };

const sortCoinsByVolumeAsc =()=>{
    coins.sort((a,b)=>{
        return a.total_volume - b.total_volume;
    });
    renderCoins(coins,currentPage);
};


const sortCoinsByVolumeDesc =()=>{
    coins.sort((a,b)=>{
        return b.total_volume - a.total_volume;
    });
    renderCoins(coins,currentPage);
};

const sortCoinsByMarketCapAsc = ()=>{
    coins.sort((a,b)=>{
        return a.market_cap - b.market_cap;
    });
    renderCoins(coins,currentPage);
};

const sortCoinsByMarketCapDesc = ()=>{
    coins.sort((a,b)=>{
        return b.market_cap - a.market_cap;
    });
    renderCoins(coins,currentPage);
};

const showLoader = () =>{
    loader.style.display = "block";

}

const hideLoader =()=>{
    loader.style.display = "none";
}


window.onload = async ()=>{
    const coinsData = await fetchCoins(1);
    renderCoins(coinsData,1);
    updatePaginationControl();
}

nextButton.addEventListener("click",handleNextClick);
prevButton.addEventListener("click",handlePrevClick);
sortPriceAsc.addEventListener("click",sortCoinsByPriceAsc);
sortPriceDesc.addEventListener("click",sortCoinsByPriceDesc);
sortVolumeAsc.addEventListener("click",sortCoinsByVolumeAsc);
sortVolumeDesc.addEventListener("click",sortCoinsByVolumeDesc);
sortMarketCapAsc.addEventListener("click",sortCoinsByMarketCapAsc);
sortMarketCapDesc.addEventListener("click",sortCoinsByMarketCapDesc);

