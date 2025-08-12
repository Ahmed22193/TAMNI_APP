document.getElementById('myForm').addEventListener('submit', handleSubmit);

function validateEgyptianPhone(phone) {
    const egyptianPhoneRegex = /^(010|011|012|015)[0-9]{8}$/;
    return egyptianPhoneRegex.test(phone);
}
document.getElementById("phone").addEventListener('input', function() {
    if (!validateEgyptianPhone(this.value)) {
        document.getElementById("error-message").innerText = "رقم الهاتف غير صحيح";
        document.getElementById("error-message").style.opacity = 1;
        document.getElementById("error-message").style.transform = "translateX(-40px)";
    } else {
        document.getElementById("error-message").innerText = "";
        document.getElementById("error-message").style.opacity = 0;
        document.getElementById("error-message").style.transform = "translateX(0)";
    }
});


function handleSubmit(e){

    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const middleName = document.getElementById("middleName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const government = document.getElementById("government").value.trim();
    const address = document.getElementById("address").value.trim();
    const specialization = document.getElementById("specialization").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const selectedGender = document.querySelector('input[name="gender"]:checked').value;

    const api_message = document.getElementById("api-message");
    
   if (password !== confirmPassword) {
       document.getElementById("error-message").innerText = "كلمة السر غير متطابقة";
       document.getElementById("error-message").style.opacity = 1;
       document.getElementById("error-message").style.transform = "translateX(-40px)";
       return;
   }
   document.getElementById("error-message").innerText ='';
   document.getElementById("error-message").style.opacity = 0;

   document.getElementById("submitBtn").innerText = '...جاري الارسال';
   document.getElementById("submitBtn").disabled = true;

   const formData = {
       firstName,
       middleName,
       lastName,
       government,
       address,
       specialest:specialization,
       phone,
       password,
       userType: "DOCTOR",
       gender:selectedGender

   };



   fetch('https://tamni.vercel.app/api/auth/signUp', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json' 
    },
    body: JSON.stringify(formData)
    })
    .then(async response => {
        const data = await response.json();

        if (!response.ok) {
            const errorMsg = data.err || data.message || data.error || 'حدث خطأ في الإرسال';
            throw new Error(errorMsg);
        }
        return data;
    })
    .then(data => {
        console.log('تم التسجيل بنجاح:', data);
        document.getElementById("submitBtn").innerText = 'تم التسجيل بنجاح';
        api_message.innerText = 'تم تسجيلك بنجاح برجاء الانتظار الى حين قبول تسجيلك';
        api_message.classList.remove('activ-error');
        api_message.classList.add('activ-seccess');
        setTimeout(() => {
            document.getElementById('myForm').reset();
            window.location.href = '../pages/Auth/login.html';
        }, 3000); // بعد 3 ثواني هيروح على صفحة تسجيل الدخول
    })
    .catch(error => {
        // هنا بتعرض رسالة الخطأ اللي جايه من الـ API، مثلاً "الرقم مسجل بالفعل"
        document.getElementById("submitBtn").innerText = 'sign Up';
        document.getElementById("submitBtn").disabled = false;
        api_message.innerText = error.message;
        api_message.classList.remove('activ-seccess');
        api_message.classList.add('activ-error');
    });
}