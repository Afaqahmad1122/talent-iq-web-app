import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.js";

export const inngest = new Inngest({ id: "talent-iq" });

export const syncUser = inngest.createFunction(
  {
    id: "sync-user",
  },
  {
    event: "clerk/user.created",
  },
  async ({ event }) => {
    try {
      await connectDB();
      const { id, email_addresses, image_url, first_name, last_name } =
        event.data;

      if (!id || !email_addresses || !email_addresses[0]) {
        throw new Error("Missing required user data");
      }

      const newUser = {
        clerkId: id,
        email: email_addresses[0].email_address,
        name: `${first_name || ""} ${last_name || ""}`.trim() || "User",
        profileImage: image_url || "",
      };

      await User.create(newUser);
      return { success: true, userId: id };
    } catch (error) {
      console.error("Error syncing user:", error);
      throw error;
    }
  }
);

export const deleteUser = inngest.createFunction(
  {
    id: "delete-user",
  },
  {
    event: "clerk/user.deleted",
  },
  async ({ event }) => {
    try {
      await connectDB();
      const { id } = event.data;

      if (!id) {
        throw new Error("Missing user ID");
      }

      const deletedUser = await User.findOneAndDelete({ clerkId: id });

      if (!deletedUser) {
        console.warn(`User with clerkId ${id} not found in database`);
        return { success: false, message: "User not found" };
      }

      return { success: true, userId: id };
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
);
