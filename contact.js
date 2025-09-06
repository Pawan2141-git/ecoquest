// Database connection

const form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name.value,
      email: form.email.value,
      topic: form.topic.value,
      message: form.message.value
    };

    try {
      const res = await fetch("http://localhost:3000/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const out = await res.json();
      if (out.ok) {
        alert("Message sent successfully!");
        form.reset();
      } else {
        alert("Error: " + (out.error || "Check fields"));
      }
    } catch (err) {
      alert("Failed to connect to server: " + err.message);
    }
  });