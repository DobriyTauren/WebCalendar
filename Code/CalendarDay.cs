using Microsoft.AspNetCore.Components;
using System.Drawing;

namespace WebCalendar.Client.Code
{
    public class CalendarDay
    {
        public DateTime Date { get; set; }
        public Color Color { get; set; } = Color.White;
        public bool IsMarked { get; set; }
        public ElementReference ColorInputRef { get; set; }
    }
}
