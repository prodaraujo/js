const clicarBuscar = () => {
  let cidade = $(".search input").val();
  
  buscaCidade(cidade);
};

const key = "7eb38250465fc7c922663aeff0643348";

const preencherTela = (data) => {
  console.log(data)
  $(".cidade").text(data.name);
  $(".temp").text(Math.floor(data.main.temp) + "°C");
  $(".parc").text(data.weather[0].description);
  $(".umidade").text(data.main.humidity + "%");
  $(".vento").text(conversorVel(data.wind.speed)+" Km/h");
  
  let icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  $(".img-previsao").attr("src", icon);
};

const buscaCidade = async (cidade) => {
  try {
    const resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${key}&lang=pt_br&units=metric`);
    const data = await resp.json();
  
    if(!resp.ok) {
      throw new Error(`Erro HTTP ${resp.status}: ${data.message}`)
    }

    preencherTela(data);
    view(data);
  } catch (err) {
    console.error(err.message);
    alert(err.message)
  }
};

const view = (data, err) => {
  const $content = $(".content");
  
  if (data.cod === 200 || err) {
    $content.removeClass("hidden");
  } else {
    $content.addClass("hidden");
  }
};

const conversorVel = (velocidadeMS) => (velocidadeMS * 3.6).toFixed(1);