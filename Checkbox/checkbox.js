// Checkbox

const myCheckbox=document.getElementById("myCheckbox");
const visaBtn=document.getElementById("visaBtn");
const masterCardBtn=document.getElementById("masterCardBtn");
const payPalBtn=document.getElementById("payPalBtn");
const mySubmit=document.getElementById("mySubmit");
const subResult=document.getElementById("subResult");
const paymentResult=document.getElementById("paymentResult");

mySubmit.onclick=function(){
  if(myCheckbox.checked){
   subResult.textContent="You are Subscribed";
  }
  else{
    subResult.textContent="You are not Subscribed";
  }

  if(visaBtn.checked){
    paymentResult.textContent="You are paying with visa";
  }
  else if(masterCardBtn.checked){
        paymentResult.textContent="You are paying with masterCard";

  }
  else if(payPalBtn.checked){
        paymentResult.textContent="You are paying with PayPal";

  }
  else{
        paymentResult.textContent="You must select a payment type";

  }
}

