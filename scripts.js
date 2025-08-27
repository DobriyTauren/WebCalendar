window.adjustPalettePosition = (paletteId, buttonId) => {
    const palette = document.getElementById(paletteId);
    const button = document.getElementById(buttonId);
    if (!palette || !button) return;

    palette.style.top = '';
    palette.style.bottom = '';
    palette.style.left = '';
    palette.style.right = '';
    palette.style.transform = '';

    const paletteRect = palette.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Вертикальное смещение
    if (paletteRect.bottom > viewportHeight) {
        palette.style.top = '';
        palette.style.bottom = `${buttonRect.height + 8}px`;
    } else {
        palette.style.top = `${buttonRect.height + 8}px`;
        palette.style.bottom = '';
    }

    // Горизонтальное смещение
    // Если палитра выходит за правую границу
    if (paletteRect.right > viewportWidth) {
        palette.style.left = 'auto';
        palette.style.right = '0px';
        palette.style.transform = 'translateX(0)';
    }
    // Если палитра выходит за левую границу
    else if (paletteRect.left < 0) {
        palette.style.left = '0px';
        palette.style.right = 'auto';
        palette.style.transform = 'translateX(0)';
    }
};


window.registerPaletteOutsideClick = (paletteId, dotNetRef) => {
    function handler(e) {
        const palette = document.getElementById(paletteId);
        if (!palette) return;
        if (!palette.contains(e.target)) {
            dotNetRef.invokeMethodAsync('HidePalette');
        }
    }
    document.addEventListener('mousedown', handler);

    // Возвращаем функцию для удаления обработчика
    return {
        dispose: () => document.removeEventListener('mousedown', handler)
    };
};

window.drawHighchartsStats = function (monthLabels, monthData, weekDayLabels, weekDayData, isDark) {
    // Tailwind-подобные цвета и стили
    const baseColors = isDark
        ? {
            background: 'rgba(26,32,44,0)', // bg-gray-900 с прозрачностью
            text: '#F3F4F6', // text-gray-100
            grid: 'rgba(55,65,81,0.3)', // grid-gray-700
            accent: '#60a5fa', // blue-400
            accent2: '#fbbf24', // yellow-400
            border: 'rgba(55,65,81,0.5)', // border-gray-700
            tooltipBg: 'rgba(31,41,55,0.95)', // bg-gray-800
            tooltipText: '#F3F4F6'
        }
        : {
            background: 'rgba(255,255,255,0)', // bg-white с прозрачностью
            text: '#222', // text-gray-900
            grid: 'rgba(229,231,235,0.5)', // grid-gray-200
            accent: '#3b82f6', // blue-500
            accent2: '#f59e42', // orange-400
            border: 'rgba(229,231,235,0.7)', // border-gray-200
            tooltipBg: 'rgba(255,255,255,0.98)', // bg-white
            tooltipText: '#222'
        };

    // Общие настройки для обоих графиков
    const chartCommon = {
        chart: {
            type: 'spline',
            backgroundColor: baseColors.background,
            borderRadius: 18,
            style: { fontFamily: 'inherit' },
            shadow: false
        },
        title: { text: null },
        legend: { enabled: false },
        credits: { enabled: false },
        tooltip: {
            backgroundColor: baseColors.tooltipBg,
            style: { color: baseColors.tooltipText, fontWeight: '500' },
            borderRadius: 10,
            borderColor: baseColors.border
        }
    };

    Highcharts.chart('days-chart', {
        ...chartCommon,
        xAxis: {
            categories: monthLabels,
            labels: { style: { color: baseColors.text, fontWeight: '500' } },
            gridLineColor: baseColors.grid,
            lineColor: baseColors.border
        },
        yAxis: {
            min: 0,
            title: { text: 'Кол-во дней', style: { color: baseColors.text, fontWeight: '500' } },
            labels: { style: { color: baseColors.text } },
            gridLineColor: baseColors.grid,
            lineColor: baseColors.border
        },
        series: [{
            name: 'Дни',
            data: monthData,
            color: {
                linearGradient: [0, 0, 0, 300],
                stops: [
                    [0, baseColors.accent],
                    [1, baseColors.accent2]
                ]
            },
            lineWidth: 4,
            marker: {
                enabled: true,
                radius: 6,
                fillColor: baseColors.accent,
                lineColor: baseColors.border,
                lineWidth: 2,
                states: {
                    hover: { fillColor: baseColors.accent2 }
                }
            },
            dataLabels: {
                enabled: true,
                style: { color: baseColors.text, fontWeight: 'bold', textOutline: 'none' },
            }
        }]
    });

    Highcharts.chart('weekdays-chart', {
        ...chartCommon,
        xAxis: {
            categories: weekDayLabels,
            labels: { style: { color: baseColors.text, fontWeight: '500' } },
            gridLineColor: baseColors.grid,
            lineColor: baseColors.border
        },
        yAxis: {
            min: 0,
            title: { text: 'Среднее количество отметок', style: { color: baseColors.text, fontWeight: '500' } },
            labels: { style: { color: baseColors.text } },
            gridLineColor: baseColors.grid,
            lineColor: baseColors.border
        },
        series: [{
            name: 'Среднее по дням недели',
            data: weekDayData,
            color: {
                linearGradient: [0, 0, 0, 300],
                stops: [
                    [0, baseColors.accent2],
                    [1, baseColors.accent]
                ]
            },
            lineWidth: 4,
            marker: {
                enabled: true,
                radius: 6,
                fillColor: baseColors.accent2,
                lineColor: baseColors.border,
                lineWidth: 2,
                states: {
                    hover: { fillColor: baseColors.accent }
                }
            },
            dataLabels: {
                enabled: true,
                style: { color: baseColors.text, fontWeight: 'bold', textOutline: 'none' },
            }
        }]
    });
};
