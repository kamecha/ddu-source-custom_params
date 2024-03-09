import { GatherArguments } from "https://deno.land/x/ddu_vim@v3.10.2/base/source.ts";
import { BaseSource, Item } from "https://deno.land/x/ddu_vim@v3.10.2/types.ts";

type Params = {
  items: Item<unknown>[];
  gatherCallbackId: string;
};

export class Source extends BaseSource<Params> {
  gather(args: GatherArguments<Params>): ReadableStream<Item<unknown>[]> {
    return new ReadableStream({
      async start(controller) {
        let items: Item<unknown>[] = args.sourceParams.items;
        // denops#callback#callはエラーを投げることがあるのでtry-catchする
        if (args.sourceParams.gatherCallbackId !== "") {
          try {
            const gatheredItems = await args.denops.call(
              "denops#callback#call",
              args.sourceParams.gatherCallbackId,
              args,
            );
            items = items.concat(gatheredItems as Item<unknown>[]);
          } catch (e) {
            console.error(e);
          }
        }
        controller.enqueue(items);
        controller.close();
      },
    });
  }
  params(): Params {
    return {
      items: [],
      gatherCallbackId: "",
    };
  }
}
