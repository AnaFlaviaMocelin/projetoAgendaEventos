const crypto = require("node:crypto");

const events = [
  {
    id: crypto.randomUUID(),
    name: "Show do Metallica",
    description: "Show do Metallica no Couto Pereira",
    tags: ["Rock", "Metallica", "Couto Pereira"],
    where: "Curitiba, Paraná, Couto Pereira",
    when: "01/06/2023",
    price: "R$500,00",
    thumbnail: "https://picsum.photos/id/1/200/300",
  },
  {
    id: crypto.randomUUID(),
    name: "Show do Red Hot Chili Peppers",
    description: "Show do Red Hot Chili Peppers no Couto Pereira",
    tags: ["Rock", "Red Hot Chili Peppers", "Couto Pereira"],
    where: "Curitiba, Paraná, Couto Pereira",
    when: "01/07/2023",
    price: "R$350,00",
    thumbnail: "https://picsum.photos/id/1/200/300",
  },
];

module.exports = {
  findManyEvents: async function (req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/')
    }
    const pagination = {
      items: events,
      metadata: {
        count: events.length,
        page: 0,
        pageSize: 10,
        cursor: [...events].pop()?.id,
      },
    };
    return res.render("list-events", { pagination });
  },
  newEvent: async function (req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/')
    }
    return res.render("new-event");
  },
  createEvent: async function (req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect('/')
    }
    const data = req.body;

    const event = {
      id: crypto.randomUUID(),
      name: data?.name ?? "Escrever qual é o titulo",
      description: data?.description ?? "Qual é a descrição",
      tags: data?.tags
        ? typeof data.tags === "string"
          ? [data.tags]
          : data.tags
        : [],
      where: data?.where ?? "A onde vai ser o evento",
      when: data?.when ?? "Quando vai ser o evento",
      thumbnail: data?.thumbnail ?? "https://picsum.photos/id/1/200/300",
      price: data?.price ?? "R$0,00",
    };

    events.push(event);

    return res.redirect("/events");
  },
};
