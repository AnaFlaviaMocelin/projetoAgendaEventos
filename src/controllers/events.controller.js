const crypto = require("node:crypto");

const mongoEventsRepository = require("../repositories/mongo-events.repository");

module.exports = {
  findManyEvents: async function (req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect("/");
    }

    const events = await mongoEventsRepository.findMany();

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
      return res.redirect("/");
    }

    return res.render("new-event");
  },
  createEvent: async function (req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect("/");
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

    await mongoEventsRepository.create(event);

    return res.redirect("/events");
  },
};
