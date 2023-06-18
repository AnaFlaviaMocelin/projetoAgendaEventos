const crypto = require("node:crypto");

const mongoEventsRepository = require("../repositories/mongo-events.repository");

const googleCalendarService = require("../services/google-calendar.service");

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

    console.log(pagination, "pagination");

    return res.render("list-events", {
      pagination,
      user: req.user,
      eventsIds: events.map((event) => event._id).join(","),
    });
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
  deleteEvent: async function (req, res) {
    const { id } = req.params;

    console.log(req.params, req.query, req.body);

    console.log("Deleting event", id);

    const isDeleted = await mongoEventsRepository.deleteById(id);

    console.log("Event is deleted", isDeleted);

    return res.status(200).send({ message: "Event deleted", error: false });
  },
  createInGoogleCalendar: async function (req, res) {
    if (!req.user || !req.user?.isGoogleUser) {
      return res.status(403).send({
        message: "User is not authenticated with google",
        error: true,
      });
    }

    const user = req.user;

    const { id } = req.params;

    console.log("creating in google calendar", id);

    const event = await mongoEventsRepository.findOneById(id);

    if (!event) {
      return res.status(404).send({ message: "Event not found", error: true });
    }

    const eventStartAt = new Date(event.when);
    const eventEndAt = new Date(eventStartAt);
    const timeZone = "America/Sao_Paulo";
    eventEndAt.setHours(eventEndAt.getDate() + 1);

    try {
      console.log("Creating event in google");
      await googleCalendarService.createEvent({
        startDate: eventStartAt,
        endDate: eventEndAt,
        timeZone,
        summary: `Evento: ${event.name}`,
        location: event.where,
        attendees: [
          {
            email: user.email,
          },
        ],
      });
    } catch (error) {
      console.log("Error creating google event");
      console.error(error);
      return res.status(500).send({
        message: "Error creating event in google calendar",
        error: false,
      });
    }

    return res.status(200).send({
      message: "Event is created in google calendar",
      error: false,
    });
  },
};
