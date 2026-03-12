// controllers/workflow.controller.js
import { serve } from "@upstash/workflow/express";
import Subscription from "../models/subscription.model.js";
import dayjs from "dayjs";
import { sendReminderEmail } from "../utils/send-email.js";
const REMINDERS = [7, 5, 2, 1];

export const sendReminders = serve(async (context) => {
  // show me an example of this context, what the hell is it. is it req, res, next as a whole?
  const { subscriptionId } = context.requestPayload;
  const subscription = await fetchSubscription(context, subscriptionId);
  if (!subscription || subscription.status !== "active") return;
  const renewalDate = dayjs(subscription.renewalDate);

  if (renewalDate.isBefore(dayjs())) {
    console.log(
      `Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`,
    );
    return;
  }
  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, 'day');
    if (reminderDate.isAfter(dayjs())) {
        await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
    }
    if (dayjs().isSame(reminderDate, 'day')) {
        await triggerReminder(context, `${daysBefore} days before reminder`, subscription)
    }
  }

});

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run("get subscription", async () => {
    return Subscription.findById(subscriptionId).populate("user", "name email"); // having truble understanding why we need to wrap this in context.run()
  });
};

const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleeping until ${label} reminder at ${date}`);
    await context.sleepUntil(label, date.toDate()); // why don't we use return before await, eg. return await context.SleepUntil. like  return await context.run("get subscription", async () => {
}

const triggerReminder = async (context, label, subscription) => {
    return await context.run(label, async () => {
        console.log(`Triggering ${label} reminder`);
        await sendReminderEmail({
          to: subscription.user.email,
          type: label,
          subscription,
        })
    })
}