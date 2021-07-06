from locust import HttpUser, User, task, between
from random import randrange
from json import JSONDecodeError

NUM_ITEMS = 1

class WindowShopper(HttpUser):
    weight = 3

    def on_start(self):
        with self.client.post(f'/api/carts', json={"taxes": randrange(10), "discounts": randrange(50)}) as response:
            try:
                self.itemIDs = []
                self.cartsID = response.json()
            except JSONDecodeError:
                response.failure('Response could not be parsed.')

    @task
    def browse(self):
        with self.client.get(f'/api/items') as response:
            try:
                self.itemsViewing = response.json()
            except JSONDecodeError:
                response.failure('Response could not be parsed.')

    wait_time = between(0.5, 10)

class InteractiveShopper(WindowShopper):
    weight = 2

    @task
    def browseAndAddToCart(self):
        with self.client.get(f'/api/items') as response:
            try:
                self.itemsViewing = response.json()
                randItemsID = self.itemsViewing[randrange(len(self.itemsViewing))]['itemsID']
                if not any(randItemsID == itemID for itemID in self.itemIDs):
                    self.client.post(f'/api/carts/{self.cartsID}/items/{randItemsID}')
                    self.itemIDs.append(randItemsID)
            except JSONDecodeError:
                response.failure('Response could not be parsed.')


    wait_time = between(0.5, 10)



def main():
    pass


if __name__=='__main__':
    main()
