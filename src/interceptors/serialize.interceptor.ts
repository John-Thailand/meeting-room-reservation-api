import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";

// Observable 複数の非同期データを扱えるストリーム型
// next.handle()はObservableを返す。これに.pipe()を使用して処理の前後に割り込むことができる。
export class SerializeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // Run something before a request is handled
    // by the request handler
    console.log('Im running before the handler', context)

    return handler.handle().pipe(
      map((data: any) => {
        // Run something before the response is sent out
        console.log('Im running before response is sent out', data)
      })
    )
  }
}
