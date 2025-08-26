using Blazored.LocalStorage;
using System.Drawing;
using WebCalendar.Client.Code;

public class CalendarStorageService
{
    private readonly ILocalStorageService _localStorageService;
    public class CalendarDayDto
    {
        public DateTime Date { get; set; }
        public string ColorRgba { get; set; } = "rgba(255,255,255,1)";
        public bool IsMarked { get; set; }
    }

    public CalendarStorageService(ILocalStorageService localStorageService)
    {
        _localStorageService = localStorageService;
    }

    public static CalendarDayDto ToDto(CalendarDay day)
    {
        var a = 1.0; // Если нужен альфа-канал, добавьте его в CalendarDay
        return new CalendarDayDto
        {
            Date = day.Date,
            ColorRgba = $"rgba({day.Color.R},{day.Color.G},{day.Color.B},{a})",
            IsMarked = day.IsMarked
        };
    }

    public static CalendarDay FromDto(CalendarDayDto dto)
    {
        var color = ParseRgba(dto.ColorRgba);
        return new CalendarDay
        {
            Date = dto.Date,
            Color = color,
            IsMarked = dto.IsMarked
        };
    }

    // Парсер строки RGBA в Color
    public static Color ParseRgba(string rgba)
    {
        // Ожидается формат "rgba(r,g,b,a)"
        var parts = rgba.Replace("rgba(", "").Replace(")", "").Split(',');
        if (parts.Length >= 4 &&
            int.TryParse(parts[0], out int r) &&
            int.TryParse(parts[1], out int g) &&
            int.TryParse(parts[2], out int b) &&
            double.TryParse(parts[3], System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out double a))
        {
            return Color.FromArgb((int)(a * 255), r, g, b);
        }
        return Color.White;
    }

    public async Task SaveDays(List<CalendarDay> days)
    {
        var dtos = days.Select(ToDto).ToList();
        await _localStorageService.SetItemAsync("calendarDays", dtos);
    }

    public async Task SaveDay(CalendarDay day)
    {
        var days = await LoadDays();
        var existing = days.FirstOrDefault(d => d.Date.Date == day.Date.Date);
        if (existing != null)
        {
            existing.Color = day.Color;
            existing.IsMarked = day.IsMarked;
        }
        else
        {
            days.Add(day);
        }
        await SaveDays(days);
    }

    public async Task<List<CalendarDay>> LoadDays()
    {
        var dtos = await _localStorageService.GetItemAsync<List<CalendarDayDto>>("calendarDays");
        return dtos?.Select(FromDto).ToList() ?? new List<CalendarDay>();
    }

    public async Task DeleteDay(CalendarDay day)
    {
        var days = await LoadDays();
        var toRemove = days.FirstOrDefault(d => d.Date.Date == day.Date.Date);
        if (toRemove != null)
        {
            days.Remove(toRemove);
            await SaveDays(days);
        }
    }
}
