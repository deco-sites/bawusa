import { signal } from "@preact/signals";
import { Device } from "deco/utils/device.ts";

const deviceSignal = signal(<Device> "desktop");

const state = {
  deviceSignal,
};

export const useDevice = () => state;
