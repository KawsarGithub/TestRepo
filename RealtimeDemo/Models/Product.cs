namespace RealtimeDemo.Models
{
    using System;

    using Newtonsoft.Json;

    [Serializable]
    public class Product
    {
        public Product()
        {
            Id = Guid.NewGuid();
        }

        [JsonProperty("id")]
        public Guid Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("price")]
        public decimal Price { get; set; }
    }
}