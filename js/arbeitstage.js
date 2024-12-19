export function calculateWorkingDays(startDate, endDate) {
    const holidays = [
        new Date('2024-01-01'), // Neujahr
        new Date('2024-03-29'), // Karfreitag
        new Date('2024-04-01'), // Ostermontag
        new Date('2024-05-01'), // Tag der Arbeit
        new Date('2024-05-09'), // Christi Himmelfahrt
        new Date('2024-05-20'), // Pfingstmontag
        new Date('2024-10-03'), // Tag der Deutschen Einheit
        new Date('2024-11-01'), // Allerheiligen
        new Date('2024-12-25'), // 1. Weihnachtstag
        new Date('2024-12-26')  // 2. Weihnachtstag
    ];
    
    let currentDate = new Date(startDate);
    let workingDays = 0;
    
    while (currentDate <= endDate) {
        const day = currentDate.getDay();
        const isHoliday = holidays.some(holiday => 
            holiday.getTime() === currentDate.getTime());
        
        if (day !== 0 && day !== 6 && !isHoliday) {
            workingDays++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return workingDays;
}