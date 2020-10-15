import React, {useState, useEffect, useMemo, useRef} from 'react'
import M from 'materialize-css/dist/js/materialize.min.js'
import useFetchItems from '../useFetchEvents'
import moment from 'moment'

export default function EventsList() {

    const {events} = useFetchItems()
    const [sortedEvents, setSortedEvents] = useState(events)
    const [eventsList, setEventsList] = useState([])
    const [recordsOnPage, setRecordsOnPage] = useState(10)
    const [currentPage, setCurrentPage ] = useState(1);
    const [maxPage, setMaxPage] = useState(0)
    const [pages, setPages] = useState([])
    // const [filter, setFilter] = useState({
    //     search: sortedEvents,
    //     success: sortedEvents,
    //     filteredEvents: sortedEvents
    // });
    const [searchFilter, setSearchFilter] = useState("")
    const [successFilter, setSuccessFilter] = useState("")
    const [dateFilter, setDateFilter] = useState({
        start: new Date('1970-01-01Z00:00:00:000'),
        end: new Date()
    })

    useEffect(() => {
        let datepickerStart = document.getElementById("start-date");
        let datepickerEnd = document.getElementById("end-date");
        const dateStart = M.Datepicker.init(datepickerStart, {
            format: 'dd.mm.yyyy',
            onSelect: function(date) {
                setDateFilter(prevDate => prevDate = {...prevDate, start: date})
            },
        })
        const dateEnd = M.Datepicker.init(datepickerEnd, {
            format: 'dd.mm.yyyy',
            defaultDate: new Date(),
            setDefaultDate: true,
            onSelect: function(date) {
                setDateFilter(prevDate => prevDate = {...prevDate, end: date})
            },
        })
        setEventsList(events)
    }, [])

    useEffect(() => {
        // dateStart.date = dateFilter.start
    }, [dateFilter])

    useEffect(() => {
        setMaxPage(max => max = Math.ceil(events.length / recordsOnPage))
        setSortedEvents(events)
    }, [events])

    useEffect(() => {
        setPages(prevPages => prevPages = [])
        for (let i=0; i<maxPage; i++) {
            setPages(prevPages => [...prevPages, i+1])
        }
    }, [maxPage])

    // useEffect(() => {
    //     setEventsList(prevEvents => prevEvents = sortedEvents)
    //     currentEvents()
    //     setMaxPage(max => max = Math.ceil(sortedEvents.length / recordsOnPage))
    // }, [sortedEvents])

    useEffect(() => {
        currentEvents()
    }, [currentPage])

    useEffect(() => {
        setMaxPage(max => max = Math.ceil(filteredEvents.length / parseInt(recordsOnPage) ))
        setCurrentPage(1)
        currentEvents()
    }, [recordsOnPage])

    const filteredEvents = useMemo(() => {
        return sortedEvents.filter(event => 
          (!searchFilter || event.name.toLowerCase().includes(searchFilter)) &&
          (!successFilter || event.success.toString() === successFilter) && 
          (!dateFilter.start || !dateFilter.end || (moment(event.time, "DD.MM.YYYY, hh:mm:ss").isBefore(moment(dateFilter.end)) && moment(event.time, "DD.MM.YYYY, hh:mm:ss").isAfter(moment(dateFilter.start)))))
    }, [searchFilter, sortedEvents, successFilter, dateFilter]);

    useEffect(() => {
        setEventsList(prevEvents => prevEvents = filteredEvents)
        currentEvents()
        setMaxPage(max => max = Math.ceil(filteredEvents.length / recordsOnPage))
        setCurrentPage(1)
    }, [filteredEvents])

    function handleSort(e, type, asc) {
        e.preventDefault()
        let newSortedEvents = events
        switch (type) {
            case "name":
                newSortedEvents = sortedEvents.slice().sort((a, b) => {
                    if (a.name > b.name) return 1
                    if (a.name < b.name) return -1
                    return 0
                })
                
                asc ? setSortedEvents(prevEvents => prevEvents = newSortedEvents) : setSortedEvents(prevEvents => prevEvents = newSortedEvents.reverse())
                break;
            case "login":
                newSortedEvents = sortedEvents.slice().sort((a, b) => {
                    if (a.login > b.login) return 1
                    if (a.login < b.login) return -1
                    return 0
                })
                asc ? setSortedEvents(prevEvents => prevEvents = newSortedEvents) : setSortedEvents(prevEvents => prevEvents = newSortedEvents.reverse())
                break;
            case "time":
                newSortedEvents = sortedEvents.slice().sort((a, b) => {
                    let c = moment.utc(a.time, "DD.MM.YYYY, hh:mm:ss")
                    let d = moment.utc(b.time, "DD.MM.YYYY, hh:mm:ss")
                    return moment(c).diff(moment(d))
                })
                asc ? setSortedEvents(prevEvents => prevEvents = newSortedEvents) : setSortedEvents(prevEvents => prevEvents = newSortedEvents.reverse())
                break;
            case "success":
                newSortedEvents = sortedEvents.slice().sort((a, b) => {
                    if (a.success > b.success) return 1
                    if (a.success < b.success) return -1
                    return 0
                })
                asc ? setSortedEvents(prevEvents => prevEvents = newSortedEvents) : setSortedEvents(prevEvents => prevEvents = newSortedEvents.reverse())
                console.log(eventsList)
                break;
        
            default:
                break;
        }
    }

    function nextPage() {
        setCurrentPage(currentPage => Math.min(currentPage + 1, maxPage))
    }
        
    function prevPage() {
        setCurrentPage(currentPage => Math.max(currentPage - 1, 1))
    }
    
    function goToPage(page) {
        let pageNumber = Math.max(1, page)
        setCurrentPage(currentPage => currentPage = Math.min(pageNumber, maxPage))
    }

    function currentEvents() {
        let begin = (currentPage - 1) * recordsOnPage
        let end = begin + parseInt(recordsOnPage)
        setEventsList(prevEvents => prevEvents = filteredEvents.slice(begin, end))
    }

    function handleRecordsOnPage(e) {
        e.persist()
        setRecordsOnPage(records => records = e.target.value)
    }

    function handleSearch(e) {
        setSearchFilter(e.target.value)
    }

    function handleEventsFilter(e) {
        e.persist()
        setSuccessFilter(success => success = e.target.value)
    }

    function dropFilters() {
        setSearchFilter(search => search = "")
        setSuccessFilter(success => success = "")
        setDateFilter(date => date = {
            start: null,
            end: Date.now()
        })
    }

    return (
        <div className="events-container col s10 offset-s1 card-panel grey darken-4 z-depth-0">
            <h5>Список событий</h5>
            <div className="row filter-row">
                <div className="input-field col s4">
                <input placeholder="Поиск..." value={searchFilter} onChange={(e) => handleSearch(e)} id="first_name" type="text" />
                </div>
                Дата с
                    <div className="input-field inline">
                        <input type="text" className="datepicker" id="start-date" />
                    </div>
                по
                    <div className="input-field inline">
                        <input type="text" className="datepicker" id="end-date" />
                    </div>
                <div className="input-field inline">
                    <select value={successFilter} onChange={ (e) => handleEventsFilter(e) } className="browser-default">
                        <option value="">Выберите событие</option>
                        <option value="true">Успешный вход</option>
                        <option value="false">Лицо не найдено</option>
                    </select>
                </div>
                <button onClick={() => dropFilters()} className="btn-small right">Сбросить</button>
            </div>
            <div className="input-field inline layout-number">
                <select onChange={ (e) => handleRecordsOnPage(e) } className="browser-default">
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                </select>
            </div>
            <table>
                <thead>
                <tr>
                    <th></th>
                    <th>
                        Имя
                        <a href="#" onClick={(e) => handleSort(e, 'name', true)}>▲</a>
                        <a href="#" onClick={(e) => handleSort(e, 'name', false)}>▼</a>
                    </th>
                    <th>
                        Логин
                        <a href="#" onClick={(e) => handleSort(e, 'login', true)}>▲</a>
                        <a href="#" onClick={(e) => handleSort(e, 'login', false)}>▼</a>
                    </th>
                    <th>
                        Время
                        <a href="#" onClick={(e) => handleSort(e, 'time', true)}>▲</a>
                        <a href="#" onClick={(e) => handleSort(e, 'time', false)}>▼</a>
                    </th>
                    <th>
                        Тип события
                        <a href="#" onClick={(e) => handleSort(e, 'success', true)}>▲</a>
                        <a href="#" onClick={(e) => handleSort(e, 'success', false)}>▼</a>
                    </th>
                    <th>
                        Температура
                        <a href="#">▲</a>
                        <a href="#">▼</a>
                    </th>
                </tr>
                </thead>

                <tbody>
                    {
                        eventsList.map(event => {
                            return (
                                <tr key={event.id}>
                                    <td>{event.id + 1}</td>
                                    <td>{ event.success ? event.name : '#no_face' }</td>
                                    <td>{ event.success ? event.login : '#no_face' }</td>
                                    <td>
                                        { event.time } 
                                    </td>
                                    <td>{ event.success ? 'Успешный вход' : 'Лицо не найдено' }</td>
                                    <td>Температура</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            <ul className="pagination">
                {
                (currentPage !== 1) ? <li><a href="#!" onClick={() => prevPage() }>🠐</a></li> : null
                }
                {
                    pages.map(page => {
                        return (
                        <li key={ page } className={ page === currentPage ? "active" : ""}><a href="#!" onClick={() => goToPage(page) }>{ page }</a></li>
                        )
                    })
                }
                {
                (currentPage !== maxPage) ? <li><a href="#!" onClick={() => nextPage() }>→</a></li> : null
                }
            </ul>
        </div>
    )
}
