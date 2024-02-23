import { GatherArguments } from "https://deno.land/x/ddu_vim@v3.10.2/base/source.ts";
import { BaseSource, Item } from "https://deno.land/x/ddu_vim@v3.10.2/types.ts";

type Params = {
  items: Item<unknown>[];
};

export class Source extends BaseSource<Params> {
  gather(args: GatherArguments<Params>): ReadableStream<Item<unknown>[]> {
    return new ReadableStream({
      start(controller) {
        controller.enqueue(args.sourceParams.items);
        controller.close();
      },
    });
  }
  params(): Params {
    return {
      items: [],
    };
  }
}
