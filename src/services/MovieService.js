import axios from 'axios';

class MovieService {
    constructor() {
        this.api = axios.create({
            baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000/api',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Mock data for testing
        this.mockMovies = [
            {
                id: 15,
                title: "Oppenheimer",
                year: 2023,
                rating: 8.8,
                duration: "3h 1min",
                description: "A história do físico americano J. Robert Oppenheimer e seu papel no desenvolvimento da bomba atômica durante a Segunda Guerra Mundial.",
                poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
                genres: ["Drama", "História", "Biografia"],
                director: "Christopher Nolan",
                cast: [
                    {
                        name: "Cillian Murphy",
                        character: "J. Robert Oppenheimer",
                        photo: "https://m.media-amazon.com/images/M/MV5BMTUxMzU2MTk1OF5BMl5BanBnXkFtZTgwNDgzODU3NzE@._V1_UY317_CR7,0,214,317_AL_.jpg"
                    },
                    {
                        name: "Emily Blunt",
                        character: "Katherine Oppenheimer",
                        photo: "https://m.media-amazon.com/images/M/MV5BMTUxNDY4MTMzM15BMl5BanBnXkFtZTcwMjg5NzM2Ng@@._V1_UY317_CR5,0,214,317_AL_.jpg"
                    },
                    {
                        name: "Robert Downey Jr.",
                        character: "Lewis Strauss",
                        photo: "https://m.media-amazon.com/images/M/MV5BNzg1MTUyNDYxOF5BMl5BanBnXkFtZTgwNTQ4MTE2MjE@._V1_UY317_CR12,0,214,317_AL_.jpg"
                    }
                ],
                country: "EUA",
                language: "Inglês"
            },
            {
                id: 16,
                title: "Dune: Part Two",
                year: 2024,
                rating: 8.6,
                duration: "2h 46min",
                description: "Paul Atreides se une a Chani e aos Fremen enquanto busca vingança contra os conspiradores que destruíram sua família.",
                poster: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
                genres: ["Ficção Científica", "Aventura", "Drama"],
                director: "Denis Villeneuve",
                cast: [
                    {
                        name: "Timothée Chalamet",
                        character: "Paul Atreides",
                        photo: "https://m.media-amazon.com/images/M/MV5BOWU1Nzg0M2ItYjEzMi00ODliLThkODAtNGEyYzRkZTBmMmEzXkEyXkFqcGdeQXVyNDk2MjQ4Mzk@._V1_UY317_CR13,0,214,317_AL_.jpg"
                    },
                    {
                        name: "Zendaya",
                        character: "Chani",
                        photo: "https://m.media-amazon.com/images/M/MV5BMjAxZTk4NDAtYjI3Mi00OTk3LTg0NDEtNWFlNzE5NDM5MWM1XkEyXkFqcGdeQXVyOTI3MjYwOQ@@._V1_UY317_CR12,0,214,317_AL_.jpg"
                    },
                    {
                        name: "Rebecca Ferguson",
                        character: "Lady Jessica",
                        photo: "https://m.media-amazon.com/images/M/MV5BNzA4NDA1MTA5NV5BMl5BanBnXkFtZTcwNjMyNTQ3OA@@._V1_UY317_CR6,0,214,317_AL_.jpg"
                    }
                ],
                country: "EUA",
                language: "Inglês"
            },
            {
                id: 14,
                title: "FLOW",
                year: 2024,
                rating: 7.5,
                duration: "1h 45min",
                description: "Em um futuro próximo onde a música se tornou ilegal, uma jovem descobre que tem o poder de criar música através da dança. Ela se junta a um grupo de rebeldes que usam a música como forma de resistência.",
                poster: "https://maceioshopping.com/app/uploads/2025/02/flow-poster.jpg",
                genres: ["Science-Fiction", "Musical", "Drame"],
                director: "David Merlet",
                cast: ["Mehdi Kerkouche", "Fanny Sage", "Merlin Camozzi"],
                country: "France",
                language: "Français"
            },
            {
                id: 2,
                title: "Batman: O Cavaleiro das Trevas",
                year: 2008,
                rating: 9.0,
                duration: "2h 32min",
                description: "Quando o Coringa causa destruição e caos em Gotham, Batman deve enfrentar um dos maiores testes psicológicos e físicos de sua capacidade de lutar contra a injustiça.",
                poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
                genres: ["Ação", "Crime", "Drama"],
                director: "Christopher Nolan",
                cast: [
                    {
                        name: "Christian Bale",
                        character: "Bruce Wayne / Batman",
                        photo: "https://m.media-amazon.com/images/M/MV5BMTkxMzk4MjQ4MF5BMl5BanBnXkFtZTcwMzExODQxOA@@._V1_UY317_CR4,0,214,317_AL_.jpg"
                    },
                    {
                        name: "Heath Ledger",
                        character: "Coringa",
                        photo: "https://m.media-amazon.com/images/M/MV5BMTI2NTY0NzA4MF5BMl5BanBnXkFtZTYwMjE1MDE0._V1_UX214_CR0,0,214,317_AL_.jpg"
                    },
                    {
                        name: "Aaron Eckhart",
                        character: "Harvey Dent",
                        photo: "https://m.media-amazon.com/images/M/MV5BMTc4MTAyNzMzNF5BMl5BanBnXkFtZTcwMzQ5MzQzMg@@._V1_UY317_CR8,0,214,317_AL_.jpg"
                    }
                ],
                country: "EUA",
                language: "Inglês"
            },
            {
                id: 3,
                title: "Interestelar",
                year: 2014,
                rating: 8.6,
                duration: "2h 49min",
                description: "Uma equipe de exploradores viaja através de um buraco de minhoca no espaço em uma tentativa de garantir a sobrevivência da humanidade.",
                poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
                genres: ["Aventura", "Drama", "Ficção Científica"],
                director: "Christopher Nolan",
                cast: [
                    {
                        name: "Matthew McConaughey",
                        character: "Cooper",
                        photo: "https://m.media-amazon.com/images/M/MV5BMTg1ODg1MzM5Ml5BMl5BanBnXkFtZTgwMDk4OTI1MDE@._V1_UY317_CR12,0,214,317_AL_.jpg"
                    },
                    {
                        name: "Anne Hathaway",
                        character: "Dr. Amelia Brand",
                        photo: "https://m.media-amazon.com/images/M/MV5BMTRhNzQ3NGMtZmQ1Mi00ZTViLTk3OTgtOTk0YzE2YTgwMmFjXkEyXkFqcGdeQXVyNzg5MzIyOA@@._V1_UY317_CR20,0,214,317_AL_.jpg"
                    },
                    {
                        name: "Jessica Chastain",
                        character: "Murphy Cooper",
                        photo: "https://m.media-amazon.com/images/M/MV5BMTU1MDM5NjczOF5BMl5BanBnXkFtZTcwOTY2MDE4OA@@._V1_UY317_CR5,0,214,317_AL_.jpg"
                    }
                ],
                country: "EUA",
                language: "Inglês"
            },
            {
                id: 4,
                title: "Matrix",
                year: 1999,
                rating: 8.7,
                duration: "2h 16min",
                description: "Um programador de computador descobre que a realidade como ele conhece é uma simulação criada por máquinas e se junta a uma rebelião para se libertar.",
                poster: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
                genres: ["Ação", "Ficção Científica"],
                director: "Lana Wachowski",
                cast: [
                    {
                        name: "Keanu Reeves",
                        character: "Neo",
                        photo: "https://m.media-amazon.com/images/M/MV5BNjUxNDcwMTg4Ml5BMl5BanBnXkFtZTcwMjU4NDYyOA@@._V1_UY317_CR15,0,214,317_AL_.jpg"
                    },
                    {
                        name: "Laurence Fishburne",
                        character: "Morpheus",
                        photo: "https://m.media-amazon.com/images/M/MV5BMTc0NjczNDc1MV5BMl5BanBnXkFtZTYwMDU0Mjg1._V1_UX214_CR0,0,214,317_AL_.jpg"
                    },
                    {
                        name: "Carrie-Anne Moss",
                        character: "Trinity",
                        photo: "https://m.media-amazon.com/images/M/MV5BMTYxMjgwNzEwOF5BMl5BanBnXkFtZTcwNTQ0NzYxMw@@._V1_UY317_CR12,0,214,317_AL_.jpg"
                    }
                ],
                country: "EUA",
                language: "Inglês"
            },
            {
                id: 5,
                title: "Clube da Luta",
                year: 1999,
                rating: 8.4,
                duration: "2h 19min",
                description: "Um homem deprimido que sofre de insônia conhece um estranho vendedor chamado Tyler Durden e se envolve em um clube clandestino de luta que evolui para algo muito mais perigoso.",
                poster: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
                genres: ["Drama", "Thriller"],
                director: "David Fincher",
                cast: [
                    {
                        name: "Brad Pitt",
                        character: "Tyler Durden",
                        photo: "https://m.media-amazon.com/images/M/MV5BMjA1MjE2MTQ2MV5BMl5BanBnXkFtZTcwMjE5MDY0Nw@@._V1_UX214_CR0,0,214,317_AL_.jpg"
                    },
                    {
                        name: "Edward Norton",
                        character: "Narrador",
                        photo: "https://m.media-amazon.com/images/M/MV5BMTYwNjQ5MTI1NF5BMl5BanBnXkFtZTcwMzU5MTI2Mw@@._V1_UY317_CR16,0,214,317_AL_.jpg"
                    },
                    {
                        name: "Helena Bonham Carter",
                        character: "Marla Singer",
                        photo: "https://m.media-amazon.com/images/M/MV5BMTUzMzUzMDg5MV5BMl5BanBnXkFtZTcwMzIxNTk3OA@@._V1_UY317_CR3,0,214,317_AL_.jpg"
                    }
                ],
                country: "EUA",
                language: "Inglês"
            },
            {
                id: 7,
                title: "O Senhor dos Anéis: O Retorno do Rei",
                year: 2003,
                rating: 9.0,
                duration: "3h 21min",
                description: "Gandalf e Aragorn lideram o Mundo dos Homens contra o exército de Sauron para desviar o olhar dele do Frodo e Sam, que se aproximam do Monte da Perdição com o Um Anel.",
                poster: "https://image.tmdb.org/t/p/w500/izPNMzffsgZUvlbiYlPxjFr3TAa.jpg",
                genres: ["Ação", "Aventura", "Fantasia"],
                director: "Peter Jackson",
                cast: [
                    {
                        name: "Elijah Wood",
                        character: "Frodo Baggins",
                        photo: "https://m.media-amazon.com/images/M/MV5BMTM0NDIxMzQ5OF5BMl5BanBnXkFtZTcwNzAyNTA4Nw@@._V1_UY317_CR10,0,214,317_AL_.jpg"
                    },
                    {
                        name: "Viggo Mortensen",
                        character: "Aragorn",
                        photo: "https://m.media-amazon.com/images/M/MV5BNDQzOTg4NzA2Nl5BMl5BanBnXkFtZTcwMzkwNjkxMg@@._V1_UY317_CR6,0,214,317_AL_.jpg"
                    },
                    {
                        name: "Ian McKellen",
                        character: "Gandalf",
                        photo: "https://m.media-amazon.com/images/M/MV5BMTQ2MjgyNjk3MV5BMl5BanBnXkFtZTcwNTA3NTY5Mg@@._V1_UY317_CR10,0,214,317_AL_.jpg"
                    }
                ],
                country: "EUA",
                language: "Inglês"
            },
            {
                id: 8,
                title: "Cidade de Deus",
                year: 2002,
                rating: 8.6,
                duration: "2h 10min",
                description: "Em Cidade de Deus, um jovem fotógrafo documenta a ascensão do crime organizado na favela onde cresceu, testemunhando a transformação do local ao longo de décadas.",
                poster: "https://image.tmdb.org/t/p/w500/k7eYdWvhYQyRQoU2TB2A2Xu2TfD.jpg",
                genres: ["Crime", "Drama"],
                director: "Fernando Meirelles",
                cast: [
                    {
                        name: "Alexandre Rodrigues",
                        character: "Buscapé",
                        photo: "https://m.media-amazon.com/images/M/MV5BMTk3NzEyMTI5MV5BMl5BanBnXkFtZTYwNDc4ODc3._V1_UY317_CR19,0,214,317_AL_.jpg"
                    },
                    {
                        name: "Leandro Firmino",
                        character: "Zé Pequeno",
                        photo: "https://m.media-amazon.com/images/M/MV5BMTkyNDQ3NzAxMV5BMl5BanBnXkFtZTcwODk4NjMzMw@@._V1_UX214_CR0,0,214,317_AL_.jpg"
                    },
                    {
                        name: "Matheus Nachtergaele",
                        character: "Sandro Cenoura",
                        photo: "https://m.media-amazon.com/images/M/MV5BNzM5MDU1NzY0NV5BMl5BanBnXkFtZTcwODk4NjMzMw@@._V1_UX214_CR0,0,214,317_AL_.jpg"
                    }
                ],
                country: "Brasil",
                language: "Português"
            },
            {
                id: 9,
                title: "Vingadores: Ultimato",
                year: 2019,
                rating: 8.4,
                duration: "3h 1min",
                description: "Após os eventos devastadores de 'Guerra Infinita', o universo está em ruínas. Com a ajuda dos aliados restantes, os Vingadores se reúnem para desfazer as ações de Thanos e restaurar o equilíbrio.",
                poster: "https://image.tmdb.org/t/p/w500/q6725aR8Zs4IwGMXzZT8aC8lh41.jpg",
                genres: ["Ação", "Aventura", "Ficção Científica"],
                director: "Irmãos Russo",
                cast: [
                    {
                        name: "Robert Downey Jr.",
                        character: "Tony Stark / Iron Man",
                        photo: "https://m.media-amazon.com/images/M/MV5BNzg1MTUyNDYxOF5BMl5BanBnXkFtZTgwNTQ4MTE2MjE@._V1_UY317_CR12,0,214,317_AL_.jpg"
                    },
                    {
                        name: "Chris Evans",
                        character: "Steve Rogers / Captain America",
                        photo: "https://m.media-amazon.com/images/M/MV5BMTU2NTg1OTQzMF5BMl5BanBnXkFtZTcwNjIyMjkyMg@@._V1_UY317_CR6,0,214,317_AL_.jpg"
                    },
                    {
                        name: "Mark Ruffalo",
                        character: "Bruce Banner / Hulk",
                        photo: "https://m.media-amazon.com/images/M/MV5BNWIzZTI1ODUtZTUzMC00NTdiLWFlOTYtZTg4MGZkYmU4YzNlXkEyXkFqcGdeQXVyNTExOTk5Nzg@._V1_UY317_CR7,0,214,317_AL_.jpg"
                    }
                ],
                country: "EUA",
                language: "Inglês"
            },
            {
                id: 10,
                title: "Parasita",
                year: 2019,
                rating: 8.6,
                duration: "2h 12min",
                description: "A família Ki-taek, pobre e desempregada, infiltra-se na vida dos ricos Parques, mas um incidente inesperado gera um caos que ameaça destruir as duas famílias.",
                poster: "https://image.tmdb.org/t/p/w500/igw938inb6Fy0YVcwIyxQ7Lu5FO.jpg",
                genres: ["Comédia", "Drama", "Thriller"],
                director: "Bong Joon-ho",
                cast: [
                    {
                        name: "Song Kang-ho",
                        character: "Ki-taek",
                        photo: "https://m.media-amazon.com/images/M/MV5BMjI4OTQ5NzE2M15BMl5BanBnXkFtZTgwMTM0Nzk0OTE@._V1_UY317_CR175,0,214,317_AL_.jpg"
                    },
                    {
                        name: "Lee Sun-kyun",
                        character: "Park Dong-ik",
                        photo: "https://m.media-amazon.com/images/M/MV5BYmQ3OTZkZDItNDJlYy00NjY5LWE1ZTAtMDc5ZGJmOWVlODYyXkEyXkFqcGdeQXVyNTI5NjIyMw@@._V1_UY317_CR51,0,214,317_AL_.jpg"
                    },
                    {
                        name: "Cho Yeo-jeong",
                        character: "Park Yeon-kyo",
                        photo: "https://m.media-amazon.com/images/M/MV5BODI4NDY1NzkyM15BMl5BanBnXkFtZTgwNzQ5MTE0OTE@._V1_UY317_CR175,0,214,317_AL_.jpg"
                    }
                ],
                country: "Coreia do Sul",
                language: "Coreano"
            },
            {
                id: 11,
                title: "Coringa",
                year: 2019,
                rating: 8.4,
                duration: "2h 2min",
                description: "Em Gotham City, o comediante fracassado Arthur Fleck encontra violentas turbulências nas ruas da cidade. Isolado e desconsiderado pela sociedade, Fleck começa uma lenta descida à loucura.",
                poster: "https://image.tmdb.org/t/p/w500/xLxgVxFWvb9hhUyCDDXxRPPnFck.jpg",
                genres: ["Crime", "Drama", "Thriller"],
                director: "Todd Phillips",
                cast: [
                    {
                        name: "Joaquin Phoenix",
                        character: "Arthur Fleck / Coringa",
                        photo: "https://m.media-amazon.com/images/M/MV5BZGMyY2Q4NTEtMWVkZS00NzcwLTkzNmQtYzBlMWZhZGNhMDhkXkEyXkFqcGdeQXVyNjk1MjYyNTA@._V1_UY317_CR7,0,214,317_AL_.jpg"
                    },
                    {
                        name: "Robert De Niro",
                        character: "Murray Franklin",
                        photo: "https://m.media-amazon.com/images/M/MV5BMjAwNDU3MzcyOV5BMl5BanBnXkFtZTcwMjc0MTIxMw@@._V1_UY317_CR13,0,214,317_AL_.jpg"
                    },
                    {
                        name: "Zazie Beetz",
                        character: "Sophie Dumond",
                        photo: "https://m.media-amazon.com/images/M/MV5BMTgzODU0NTkxMF5BMl5BanBnXkFtZTgwNzE5NzM0NDM@._V1_UY317_CR12,0,214,317_AL_.jpg"
                    }
                ],
                country: "EUA",
                language: "Inglês"
            },
            {
                id: 12,
                title: "O Auto da Compadecida",
                year: 2000,
                rating: 8.6,
                duration: "1h 44min",
                description: "As aventuras de João Grilo e Chicó, dois nordestinos pobres que vivem de pequenos golpes na vila de Taperoá, no sertão da Paraíba.",
                poster: "https://image.tmdb.org/t/p/w500/m8eFedsS7vQCZCS8WGp5n1bVD0q.jpg",
                genres: ["Comédia", "Aventura"],
                director: "Guel Arraes",
                cast: [
                    {
                        name: "Matheus Nachtergaele",
                        character: "João Grilo",
                        photo: "https://m.media-amazon.com/images/M/MV5BNzM5MDU1NzY0NV5BMl5BanBnXkFtZTcwODk4NjMzMw@@._V1_UX214_CR0,0,214,317_AL_.jpg"
                    },
                    {
                        name: "Selton Mello",
                        character: "Chicó",
                        photo: "https://m.media-amazon.com/images/M/MV5BMTk1NzM4NDg5MV5BMl5BanBnXkFtZTcwODk4NjMzMw@@._V1_UX214_CR0,0,214,317_AL_.jpg"
                    },
                    {
                        name: "Denise Fraga",
                        character: "Dora",
                        photo: "https://m.media-amazon.com/images/M/MV5BMjA3NjYzMzE1MV5BMl5BanBnXkFtZTcwODk4NjMzMw@@._V1_UX214_CR0,0,214,317_AL_.jpg"
                    }
                ],
                country: "Brasil",
                language: "Português"
            },
            {
                id: 13,
                title: "Mufasa: O Rei Leão",
                year: 2024,
                rating: 8.2,
                duration: "2h",
                description: "A história de Mufasa, o lendário rei das Terras do Reino, e sua jornada para se tornar o grande líder que conhecemos.",
                poster: "https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
                genres: ["Animação", "Aventura", "Drama"],
                director: "Barry Jenkins",
                cast: [
                    {
                        name: "Aaron Pierre",
                        character: "Mufasa (voz)",
                        photo: "https://m.media-amazon.com/images/M/MV5BOTE1ZmUyZTQtYjVkNS00MzA4LTk1MWQtNTNjOTY3ZGI5YjU1XkEyXkFqcGdeQXVyMjQwMDg0Ng@@._V1_UY317_CR12,0,214,317_AL_.jpg"
                    },
                    {
                        name: "Kelvin Harrison Jr.",
                        character: "Taka/Scar (voz)",
                        photo: "https://m.media-amazon.com/images/M/MV5BMTU5NzU5MDk5NV5BMl5BanBnXkFtZTgwNzE0MzUxNzM@._V1_UY317_CR131,0,214,317_AL_.jpg"
                    },
                    {
                        name: "Seth Rogen",
                        character: "Pumbaa (voz)",
                        photo: "https://m.media-amazon.com/images/M/MV5BMTUxMzk4NDg2NF5BMl5BanBnXkFtZTcwOTU2NDk0Nw@@._V1_UY317_CR11,0,214,317_AL_.jpg"
                    }
                ],
                country: "EUA",
                language: "Inglês"
            },
            {
                id: 1,
                title: "A Origem",
                year: 2010,
                rating: 8.8,
                duration: "2h 28min",
                description: "Um ladrão que rouba segredos corporativos através do uso da tecnologia de compartilhamento de sonhos recebe a tarefa inversa de plantar uma ideia na mente de um CEO.",
                poster: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
                genres: ["Ação", "Ficção Científica", "Suspense"],
                director: "Christopher Nolan",
                cast: [
                    {
                        name: "Leonardo DiCaprio",
                        character: "Cobb",
                        photo: "https://m.media-amazon.com/images/M/MV5BMjI0MTg3MzI0M15BMl5BanBnXkFtZTcwMzQyODU2Mw@@._V1_UY317_CR10,0,214,317_AL_.jpg"
                    },
                    {
                        name: "Joseph Gordon-Levitt",
                        character: "Arthur",
                        photo: "https://m.media-amazon.com/images/M/MV5BMTY3NTk0NDI3Ml5BMl5BanBnXkFtZTgwNDA3NjY0MjE@._V1_UY317_CR3,0,214,317_AL_.jpg"
                    },
                    {
                        name: "Ellen Page",
                        character: "Ariadne",
                        photo: "https://m.media-amazon.com/images/M/MV5BMTU3MzM3MDYzMV5BMl5BanBnXkFtZTcwNzk1Mzc3NA@@._V1_UY317_CR6,0,214,317_AL_.jpg"
                    }
                ],
                country: "EUA",
                language: "Inglês"
            },
        ];
    }

    // Get featured movie
    async getFeaturedMovie() {
        try {
            // Return O Senhor dos Anéis as the featured movie
            const featuredMovie = this.mockMovies.find(movie => movie.title === "FLOW");
            if (!featuredMovie) {
                throw new Error('Filme em destaque não encontrado');
            }
            return featuredMovie;
        } catch (error) {
            console.error('Erro ao obter filme em destaque:', error);
            throw error;
        }
    }

    // Get trending movies
    async getTrendingMovies() {
        try {
            // In a real app, this would be an API call
            // For now, return all mock movies
            return [...this.mockMovies];
        } catch (error) {
            console.error('Erro ao obter filmes em tendência:', error);
            throw error;
        }
    }

    // Get recommended movies
    async getRecommendedMovies() {
        try {
            // In a real app, this would be an API call
            // For now, return movies starting from index 1
            return this.mockMovies.slice(1);
        } catch (error) {
            console.error('Erro ao obter filmes recomendados:', error);
            throw error;
        }
    }

    // Get new releases
    async getNewReleases() {
        try {
            // In a real app, this would be an API call
            // For now, return movies starting from index 2
            return this.mockMovies.slice(2);
        } catch (error) {
            console.error('Erro ao obter lançamentos:', error);
            throw error;
        }
    }

    // Get top rated movies
    async getTopRatedMovies() {
        try {
            // In a real app, this would be an API call
            // For now, return movies starting from index 3
            return this.mockMovies.slice(3);
        } catch (error) {
            console.error('Erro ao obter filmes mais bem avaliados:', error);
            throw error;
        }
    }

    // Search movies
    async searchMovies(query) {
        try {
            // In a real app, this would be an API call
            // For now, filter mock movies based on query
            const searchQuery = query.toLowerCase();
            return this.mockMovies.filter(movie => 
                movie.title.toLowerCase().includes(searchQuery) ||
                movie.description.toLowerCase().includes(searchQuery)
            );
        } catch (error) {
            console.error('Erro ao buscar filmes:', error);
            throw error;
        }
    }

    // Get movie details
    async getMovieDetails(movieId) {
        try {
            // In a real app, this would be an API call
            // For now, find movie in mock data
            const movie = this.mockMovies.find(m => m.id === parseInt(movieId));
            if (!movie) {
                throw new Error('Filme não encontrado');
            }
            return movie;
        } catch (error) {
            console.error('Erro ao obter detalhes do filme:', error);
            throw error;
        }
    }

    // Get movies by genre
    async getMoviesByGenre(genre) {
        try {
            const response = await this.api.get(`/movies/genre/${genre}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar filmes por gênero:', error);
            throw error;
        }
    }

    // Add movie to user's watchlist
    async addToWatchlist(userId, movieId) {
        try {
            const response = await this.api.post(`/watchlist/${userId}`, { movieId });
            return response.data;
        } catch (error) {
            console.error('Erro ao adicionar filme à lista de favoritos:', error);
            throw error;
        }
    }

    // Get user's watchlist
    async getWatchlist(userId) {
        try {
            const response = await this.api.get(`/watchlist/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar lista de favoritos:', error);
            throw error;
        }
    }
}

export default new MovieService(); 