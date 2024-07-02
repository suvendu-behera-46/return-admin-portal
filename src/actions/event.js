"use server";
import prisma from "@/server/prisma";

// Create a new event
async function createEvent(data) {
  try {
    const event = await prisma.event.create({
      data,
    });
    return event;
  } catch (error) {
    throw new Error(`Failed to create event: ${error.message}`);
  }
}

// Read a single event by ID
async function getEventById(id) {
  try {
    const event = await prisma.event.findUnique({
      where: { id },
    });
    return event;
  } catch (error) {
    throw new Error(`Failed to retrieve event: ${error.message}`);
  }
}

// Read all events
async function getAllEvents() {
  try {
    const events = await prisma.event.findMany();
    console.log("==============", events);
    return events;
  } catch (error) {
    throw new Error(`Failed to retrieve events: ${error.message}`);
  }
}

// Update an event by ID
async function updateEvent(id, data) {
  try {
    const event = await prisma.event.update({
      where: { id },
      data,
    });
    return event;
  } catch (error) {
    throw new Error(`Failed to update event: ${error.message}`);
  }
}

// Delete an event by ID
async function deleteEvent(id) {
  try {
    const event = await prisma.event.delete({
      where: { id },
    });
    return event;
  } catch (error) {
    throw new Error(`Failed to delete event: ${error.message}`);
  }
}

// Group events by action
async function getEventsGroupedByAction() {
  try {
    const eventsGroupedByAction = await prisma.event.groupBy({
      by: ["action"],
      _count: {
        action: true,
      },
      _sum: {
        id: true,
      },
    });
    console.log("==============", eventsGroupedByAction);
    return eventsGroupedByAction;
  } catch (error) {
    throw new Error(
      `Failed to retrieve events grouped by action: ${error.message}`
    );
  }
}
async function getEventsByCampaignId(campaignId) {
  try {
    // Fetch the events that have the specified campaignId
    const events = await prisma.event.groupBy({
      by: ['action'],
      where: {
        campaignId: campaignId,
      },
      _count: {
        action: true,
      },
      _sum: {
        id: true,
      },
    });

    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export {
  createEvent,
  getEventById,
  getAllEvents,
  updateEvent,
  deleteEvent,
  getEventsGroupedByAction,
  getEventsByCampaignId
};
