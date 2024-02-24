import { compile } from "ejs";

/** renders an EJS template with maximum safety, blowing up if a requested value doesn't exist */
export function renderTemplate(template: string, context: any) {
    function createProxy(original: any) {
      return new Proxy(original, {
        get(target, name, receiver): any {
          if (Reflect.has(target, name)) {
            let rv = Reflect.get(target, name, receiver);
            if (typeof rv === "object") {
              return createProxy(rv);
            }
            return rv;
          }
          throw new Error(`Missing required property ${name as string}`);
        },
      });
    }
  
    const proxy = createProxy(context);
    const fn = compile(template, { localsName: "$" });
    return fn(proxy);
  }