
/**
* This is the main Node.js server script for your project
*/

require('dotenv').config()
const path = require("path")
const fs = require("fs")
const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_LOGIN,
    pass: process.env.SMTP_PASSW
  }
})

// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // Set this to true for detailed logging:
  logger: false
})

// Setup our static files
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/" // optional: default '/'
})

// Load and parse SEO data
const seo = require("./src/seo.json");

/**
* Our home page route
*
* Returns src/pages/index.hbs with data built into it
*/
fastify.get("/", function(req, rep){
  // params is an object that we could pass back to the client.
  let params = { seo: seo }
  return rep.sendFile(
    "index.html",
    path.join(__dirname, "src/pages")
  )
})


//////////////////////////////////////
// Example API endpoint or web hook //
//////////////////////////////////////
fastify.post("/api/someHook", function(req, rep){
  // Here's the IPv4 and 6, just to show where they live.
  if (req && req.headers && req.headers["x-forwarded-for"]){
    console.log(
      "req.headers['x-forwarded-for']:",
      req.headers['x-forwarded-for']
    )
  }

  if (!req.body || req.body.textField == null){
    rep.code(404).send()
    return
  }

  // Could do something with the information.
  // const textField = req.body.textField
  // ...
  rep.send({
    "msg": "We got your message, thanks!"
  })
})


fastify.post("/send-email", async (request, reply) => {
  console.log("HERE!")
  try {
    await transporter.sendMail({
      from: process.env.SMTP_LOGIN,
      to: "tom.collins@miami.edu",
      subject: "Test email",
      text: "Hello Tom,\n\nThis is a boilerplate email automatically sent by the server.\n\nBest,\nThe server"
    })

    console.log("HERE NOW!")


    return {
      success: true,
      message: "Email sent successfully"
    }
  } catch (error) {
    console.error(error)

    return reply.code(500).send({
      success: false,
      message: "Failed to send email"
    })
  }
})






// Run the server and report out to the logs.
const PORT = process.env.PORT || 3000;
fastify.listen({ port: PORT, host: "0.0.0.0" }, function(err, address){
  if (err){
    fastify.log.error(err)
    process.exit(1)
  }
  console.log(`Your app is listening on ${address}`)
  fastify.log.info(`server listening on ${address}`)
})
