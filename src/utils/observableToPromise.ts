import { BehaviorSubject, type Observable } from 'rxjs';
import { UnexpectedError } from '../errors/UnexpectedError';

/**
 * !!!
 */
export function observableToPromise<T>(observable: Observable<T>): Promise<T> {
    return new Promise((resolve, reject) => {
        let isLastValueSet = false;
        let lastValue: T;

        const subscription = observable.subscribe({
            next(value) {
                isLastValueSet = true;
                lastValue = value;
            },
            complete() {
                if (observable instanceof BehaviorSubject) {
                    resolve(observable.value);
                    return;
                }

                if (!isLastValueSet) {
                    reject(new UnexpectedError('Observable completed without emitting any value'));
                    return;
                }

                resolve(lastValue);
            },
            error(error) {
                reject(error);
            },
        });
        return () => subscription.unsubscribe();
    });
}
