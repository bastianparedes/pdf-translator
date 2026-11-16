import { processPdf } from "../processPdf";

export async function POST(request: Request) {
  return processPdf(request, "google");
}
