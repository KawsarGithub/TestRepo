namespace RealtimeDemo.Hubs
{
    using System;
    using System.Collections.Concurrent;
    using System.Collections.Generic;
    using System.Linq;

    using Microsoft.AspNet.SignalR;

    using Models;

    public class ProductsHub : Hub
    {
        private const string Room = "Products";

        private static readonly ConcurrentDictionary<string, string> Sessions = 
            new ConcurrentDictionary<string, string>();

        private static readonly ConcurrentDictionary<Guid, Product> Storage = BuildStorage(7);

        public void Join(string handle)
        {
            if (!Sessions.TryAdd(Context.ConnectionId, handle))
            {
                return;
            }

            Groups.Add(Context.ConnectionId, Room);
            Clients.OthersInGroup(Room).joined(handle);
        }

        public void Leave()
        {
            string handle;

            if (!Sessions.TryRemove(Context.ConnectionId, out handle))
            {
                return;
            }

            Groups.Remove(Context.ConnectionId, Room);
            Clients.OthersInGroup(Room).left(handle);
        }

        public IEnumerable<Product> All()
        {
            return Storage.Values.OrderBy(p => p.Name);
        }

        public Product Add(
            string name,
            string description,
            decimal price)
        {
            var product = new Product
                              {
                                  Name = name,
                                  Description = description,
                                  Price = price
                              };

            if (!Storage.TryAdd(product.Id, product))
            {
                return null;
            }

            OnDataAction("added", product);

            return product;
        }

        public void Update(Guid id,
            string name,
            string description,
            decimal price)
        {
            Product product;

            if (!Storage.TryGetValue(id, out product))
            {
                return;
            }

            product.Name = name;
            product.Description = description;
            product.Price = price;

            OnDataAction("updated", product);
        }

        public void Delete(Guid id)
        {
            Product product;

            if (!Storage.TryRemove(id, out product))
            {
                return;
            }

            OnDataAction("deleted", product);
        }

        private void OnDataAction(string action, Product product)
        {
            string handle;

            if (Sessions.TryGetValue(Context.ConnectionId, out handle))
            {
                Clients.OthersInGroup(Room)
                    .onDataAction(action, handle, product);
            }
        }

        private static ConcurrentDictionary<Guid, Product> BuildStorage(int count)
        {
            var rnd = new Random();
            var list = new Dictionary<Guid, Product>();

            for (var i = 1; i <= count; i++)
            {
                var product = new Product
                {
                    Id = Guid.NewGuid(),
                    Name = "Dummy Product Name " + i,
                    Description = "Dummy Product Description " + i,
                    Price = rnd.Next(50)
                };

                list.Add(product.Id, product);
            }

            return new ConcurrentDictionary<Guid, Product>(list);
        }
    }
}