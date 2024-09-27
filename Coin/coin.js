const BASE_URL=`https://api.coingecko.com/api`;
const loader = document.querySelector(".loader");
const options ={
    method:"GET",
    headers: {
        accept:"application/json",
        "x-cg-demo-api-key": "CG-tdE4YDbcS8ssweWRTVQbSSCk",
    },

};

const urlParams = new URLSearchParams(window.location.search);
const coinId = urlParams.get("id");

const coinImg = document.getElementById("coin-image");
const coinName = document.getElementById("coin-name");
const coinDesc = document.getElementById("coin-description");
const coinRank = document.getElementById("coin-rank");
const coinPrice = document.getElementById("coin-price");
const coinMarketCap = document.getElementById("coin-market-cap");
const ctx = document.getElementById("coin-chart");
const twentyFourHrBtn = document.getElementById("24h");
const thirtyDaysBtn = document.getElementById("30d");
const threeMonthsBtn = document.getElementById("3m");

let coinChart = new Chart(ctx, {
    type: 'line',
    data:{
        labels: [],
        datasets: [{
          label: 'Price(USD)',
          data: [],
          fill: false,
          borderColor: "gold"
        }]
      },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

const fetchCoinDataById = async ()=>{
    try{
        showLoader();
    const response = await fetch(`${BASE_URL}/v3/coins/${coinId}`,options);
    const coin = await response.json();
    hideLoader();
    return coin;
    }
    catch(err){
        console.log(err);
        hideLoader();
    }
}

const displayCoinData =async (coinData)=>{

    coinImg.src = coinData.image.large;
    coinImg.alt = coinData.name;
    coinName.textContent= coinData.name;
    coinDesc.innerHTML = coinData.description.en.split(".")[0];
    coinRank.textContent = coinData.market_cap_rank;
    coinPrice.textContent = `$${coinData.market_data.current_price.usd.toLocaleString()}`;
    coinMarketCap.textContent = `$${coinData.market_data.market_cap.usd.toLocaleString()}`;

}

const showLoader = () =>{
    loader.style.display = "block";

}

const hideLoader =()=>{
    loader.style.display = "none";
}

const fetChartData = async (days)=>{
    try{
        const response = await fetch(`${BASE_URL}/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,options);
        const pricesData = await response.json();
        updateChartData(pricesData.prices);
    }
    catch(err){
        console.log(err);
    }
}

const updateChartData = (pricesData)=>{
    const labels = pricesData.map((price)=>{
        let date = new Date(price[0]);
        return date.toLocaleDateString();
    });
    const data = pricesData.map((price)=>price[1]);

    coinChart.data.labels = labels;
    coinChart.data.datasets[0].data = data;
    coinChart.update();

}

twentyFourHrBtn.addEventListener("click",()=>{
    fetChartData("1");
})

thirtyDaysBtn.addEventListener("click",()=>{
    fetChartData("30");
})


threeMonthsBtn.addEventListener("click",()=>{
    fetChartData("90");
})


window.onload =async ()=>{
    const coinData = await fetchCoinDataById();
    displayCoinData(coinData);
    twentyFourHrBtn.click();
}