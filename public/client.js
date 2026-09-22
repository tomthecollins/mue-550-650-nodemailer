const btn = document.querySelector("#send-email")

if (btn) {
  btn.onclick = async function() {
    btn.disabled = true
    btn.textContent = "Sending..."

    try {
      const response = await fetch("/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      })

      const result = await response.json()

      console.log(result)

      if (result.success) {
        btn.textContent = "Email sent!"
      } else {
        btn.textContent = "Send failed"
      }
    } catch (error) {
      console.error(error)
      btn.textContent = "Send failed"
    }

    setTimeout(function() {
      btn.disabled = false
      btn.textContent = "Send email"
    }, 2000)
  }
}
