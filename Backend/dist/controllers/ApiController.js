"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IntegrationProductService_1 = __importDefault(require("../services/IntegrationProductService"));
const IntegrationOffersService_1 = __importDefault(require("../services/IntegrationOffersService"));
const IntegrationCoursesService_1 = __importDefault(require("../services/IntegrationCoursesService"));
const studentsService_1 = __importDefault(require("../services/studentsService"));
const md5_1 = __importDefault(require("md5"));
const studentCoursesServices_1 = __importDefault(require("../services/studentCoursesServices"));
const coursesValidityContractsService_1 = __importDefault(require("../services/coursesValidityContractsService"));
const moment_1 = __importDefault(require("moment"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendMail_1 = __importDefault(require("../services/sendMail"));
const integrationHooksHistoryService_1 = __importDefault(require("../services/integrationHooksHistoryService"));
const emailCopyService_1 = __importDefault(require("../services/emailCopyService"));
class ApiController {
    checkHealth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.json(true);
        });
    }
    hotmart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataPost = req.body;
            //Register hook
            const dataHook = {
                product_id: dataPost.prod,
                product_name: dataPost.prod_name,
                integration: 'Hotmart',
                offer: dataPost.off,
                pay_status: dataPost.status,
                student_name: dataPost.name,
                student_mail: dataPost.email,
                data_post: JSON.stringify(dataPost)
            };
            yield integrationHooksHistoryService_1.default.createNewCourse(dataHook);
            //Checking approved status
            if (dataPost.status != 'approved') {
                res.json({ success: true, message: "Parece que esta compra ainda não foi aprovada!" });
                return;
            }
            const date = (0, moment_1.default)();
            const today = date.format('YYYY-MM-DD');
            //Checando Product
            const product_id = dataPost.prod;
            const product_name = dataPost.prod_name;
            const infoProduct = yield IntegrationProductService_1.default.infoProductByCode(product_id);
            if (!infoProduct) {
                res.json({ success: true, message: `Produto ${product_name}(${product_id}) não encontrado nas configurações de integração!` });
                return;
            }
            //Checking offer product
            const offer = dataPost.name_subscription_plan
                ? dataPost.name_subscription_plan
                : dataPost.off
                    ? dataPost.off
                    : 'Sem Plano';
            const offerInfo = yield IntegrationOffersService_1.default.infoOfferByOfferPlatform(offer, infoProduct.id);
            if (!offerInfo) {
                res.json({ success: true, message: `Oferta ${offer} do ${product_name}(${product_id}) não encontrada nas configurações de integração!` });
                return;
            }
            //Check Courses Offer
            const courses = yield IntegrationCoursesService_1.default.getCoursesPlatform(infoProduct.id, offerInfo.id);
            if (courses.length == 0) {
                if (!offerInfo) {
                    res.json({ success: true, message: `Nenhum curso configurado na Oferta ${offer} do ${product_name}(${product_id}) nas configurações de integração!` });
                    return;
                }
            }
            //Information New Student   
            const student_name = dataPost.name;
            const student_mail = dataPost.email;
            const community = infoProduct.community_access;
            //Generate Password
            const length = 6;
            const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$&';
            let passwordHash = '';
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                passwordHash += characters.charAt(randomIndex);
            }
            //Create Access Student
            const dataStudent = {
                community: community,
                type: 'student',
                name: student_name,
                photo: 0,
                phone: "",
                gender: "",
                mail: student_mail,
                password: (0, md5_1.default)(passwordHash),
                city: passwordHash,
                reset: 1,
                status: 1
            };
            const student = yield studentsService_1.default.createNewStudent(dataStudent);
            if (!student) {
                res.json({ success: true, message: `Ocorreu um erro ao cadastrar o aluno na Oferta ${offer} do ${product_name}(${product_id}) nas configurações de integração!` });
                return;
            }
            //Updating status to 1
            yield studentsService_1.default.editStudent(student, { status: 1 });
            //Add Course Student
            courses.map((c, k) => __awaiter(this, void 0, void 0, function* () {
                const init = (0, moment_1.default)(today, 'YYYY-MM-DD');
                const dateValidity = c.validity_contract == "A" ? init.add(1, 'years').format('YYYY-MM-DD')
                    : c.validity_contract == "SM" ? init.add(6, 'months').format('YYYY-MM-DD')
                        : c.validity_contract == "T" ? init.add(3, 'months').format('YYYY-MM-DD')
                            : c.validity_contract == "B" ? init.add(2, 'months').format('YYYY-MM-DD')
                                : c.validity_contract == "M" ? init.add(1, 'months').format('YYYY-MM-DD')
                                    : c.validity_contract == "Q" ? init.add(15, 'days').format('YYYY-MM-DD')
                                        : c.validity_contract == "S" ? init.add(7, 'days').format('YYYY-MM-DD')
                                            : c.validity_contract == "V" ? init.add(50, 'years').format('YYYY-MM-DD')
                                                : init.add(1, 'days').format('YYYY-MM-DD');
                yield studentCoursesServices_1.default.addCourseStudent({
                    student_id: student,
                    course_id: c.course_id_students,
                    status: 1,
                    concluded: 0,
                    data_valid: dateValidity
                });
                yield coursesValidityContractsService_1.default.addContract({
                    student_id: student,
                    course_id: c.course_id_students,
                    start_validity: today,
                    end_validity: dateValidity,
                    payment_cycle: c.validity_contract
                });
            }));
            //Send Mail
            //Get Data Copy
            const copyEmail = yield emailCopyService_1.default.infoCopy(offerInfo.email_copy);
            if (!copyEmail) {
                res.json({ success: true, message: `Nenhum email de boas vindas cadastrado para esta oferta ${offer} do ${product_name}(${product_id}) nas configurações de integração!` });
                return;
            }
            let copy = null;
            let hiddenCopy = 'lugheri@live.com';
            let subject = copyEmail.subject;
            let bodyText = copyEmail.body.replace('_NOME_', student_name)
                .replace('_EMAIL_', student_mail)
                .replace('_SENHA_', passwordHash);
            /*
            
                if(product_id == 2304719){
                  subject = '[Comunidade TraderX] Seu acesso está aqui!';
                  bodyText = `<p style="font-size:18px;margin-bottom:10px">${student_name}, parabéns pela decisão de entrar na Comunidade TraderX.</p>
                           <p style="font-size:18px;margin-bottom:10px">É muito bom ter você junto de nós e poder te ajudar a se tornar um trader que multiplica.</p>
                           <p style="font-size:18px;margin-bottom:10px">O dia de hoje pode marcar o começo de uma nova história, uma história de liberdade, confiança e segurança para você e todos aqueles que ama.</p>
                           <p style="font-size:18px;margin-bottom:10px">Para acessar a plataforma aperte no link abaixo e entre com o seu usuário e senha:</p>
                           <br/>
                            <p style="font-size:18px;margin:0px"><a href="https://app.otraderquemultiplica.com.br">https://app.otraderquemultiplica.com.br</a></p>
                            <p style="font-size:18px;margin:0px"><b>Usuário:</b> ${student_mail}</p>
                            <p style="font-size:18px;margin:0px"><b>Senha:</b> ${passwordHash}</p>
                           <br/>
                           <p style="font-size:18px;margin-bottom:10px">Ao entrar na área de alunos basta apertar em “Meus Cursos” no menu lateral para acessar todos os cursos que você tem acesso e aproveitar todo conteúdo disponível.</p>
                           <p style="font-size:18px;margin-bottom:10px">Comece pela Formação em Trading MétodoX, estude e pratique aula por aula sem pular etapas, esse é um passo fundamental para que consiga obter os resultados que deseja.</p>
                           <p style="font-size:18px;margin-bottom:10px">Espero muito em breve poder contar a sua história de sucesso!</p>
                           <p style="font-size:18px;margin-bottom:10px">Abração,<br/>
                           Guilherme</p>`;
                }else if(product_id==0){//TESTE
                  subject = '[Mentoria TraderX] Seus dados de acesso!';
                  bodyText = `<p style="font-size:18px;margin-bottom:10px">Faaaala Trader, tudo certo?</p>
                          <p style="font-size:18px;margin-bottom:10px">Parabéns por tomar essa decisão que vai mudar o rumo dos seus resultados pelos próximos meses.</p>
                          <p style="font-size:18px;margin-bottom:10px"><strong>Esses são os seus dados de acesso para a área de alunos:</strong></p>
                          <p style="font-size:18px;margin-bottom:10px"><strong>Link: </strong><a href="https://app.otraderquemultiplica.com.br">app.otraderquemultiplica.com.br</a></p>
                          <p style="font-size:18px;margin-bottom:10px"><strong>Usuário: </strong>${student_mail}</p>
                          <p style="font-size:18px;margin-bottom:10px"><strong>Senha: </strong>${passwordHash}</p>
                          <p style="font-size:18px;margin-bottom:10px"><i>Agora tem algo muito importante que eu preciso que você faça para não perder nenhuma informação da mentoria.</i></p>
                          <p style="font-size:18px;margin-bottom:10px"><strong>Aperte no link abaixo e entre no grupo exclusivo para alunos da Mentoria TraderX no Telegram</strong>, ele será o nosso principal canal de comunicação durante os 2 meses de mentoria.</p>
                          <p style="font-size:18px;margin-bottom:10px"><strong style="font-size:20px">➡️ <a href="https://t.me/+PqO75q6smEA2ZWQx">ENTRAR NO GRUPO AGORA</a></strong></p>
                          <p style="font-size:18px;margin-bottom:10px">E se ainda tiver alguma dúvida pode responder esse e-mail ou enviar uma mensagem para o nosso WhatsApp de suporte. </p>
                          <p style="font-size:18px;margin-bottom:10px"><strong style="font-size:20px">➡️ <a href="https://bit.ly/suportegc">FALE COM O SUPORTE AQUI</a></strong></p>
                          <p style="font-size:18px;margin-bottom:10px"><strong>Parabéns pela decisão de se tornar um TraderX</strong>, um trader que multiplica, vamos juntos nessa jornada, vai ser incrível!</p>
                          <p style="font-size:18px;margin-bottom:10px">Abração,<br/>Guilherme</p>`;
                }else if(product_id==2770968){//Ultima Mentoria
                  subject = '[Mentoria TraderX] Seus dados de acesso!';
                  bodyText = `<p style="font-size:18px">Faaaala Trader, tudo certo?</p>
                          <p style="font-size:18px">Parabéns por tomar essa decisão que vai mudar o rumo dos seus resultados pelos próximos meses.</p>
                          <p style="font-size:18px"><strong>Esses são os seus dados de acesso para a área de alunos:</strong></p>
                          <p style="font-size:18px;"><strong>Link: </strong><a href="https://app.otraderquemultiplica.com.br">app.otraderquemultiplica.com.br</a></p>
                          <p style="font-size:18px;"><strong>Usuário: </strong>${student_mail}</p>
                          <p style="font-size:18px;"><strong>Senha: </strong>${passwordHash}</p>
                          <p style="font-size:18px"><i>Agora tem algo muito importante que eu preciso que você faça para não perder nenhuma informação da mentoria.</i></p>
                          <p style="font-size:18px"><strong>Aperte no link abaixo e entre no grupo exclusivo para alunos da Mentoria TraderX no Telegram</strong>, ele será o nosso principal canal de comunicação durante os 2 meses de mentoria.</p>
                          <p style="font-size:18px"><strong style="font-size:20px">➡️ <a href="https://t.me/+PqO75q6smEA2ZWQx">ENTRAR NO GRUPO AGORA</a></strong></p>
                          <p style="font-size:18px">E se ainda tiver alguma dúvida pode responder esse e-mail ou enviar uma mensagem para o nosso WhatsApp de suporte. </p>
                          <p style="font-size:18px"><strong style="font-size:20px">➡️ <a href="https://bit.ly/suportegc">FALE COM O SUPORTE AQUI</a></strong></p>
                          <p style="font-size:18px"><strong>Parabéns pela decisão de se tornar um TraderX</strong>, um trader que multiplica, vamos juntos nessa jornada, vai ser incrível!</p>
                          <p style="font-size:18px">Abração,<br/>Guilherme</p>`;
                }else if(product_id==3131467){//Ebook
                  subject = '[Ebook TraderX] Seu acesso está aqui!';
                  bodyText = `<p style="font-size:18px;margin-bottom:10px">${student_name}, parabéns pela decisão de adquirir o seu Ebook O Trader que Multiplica.</p>
                            <p style="font-size:18px;margin-bottom:10px">É muito bom saber que você está buscando por mais conhecimento, e garanto que neste ebook você receberá um conteúdo de qualidade para começar no trading do jeito certo.</p>
                            <p style="font-size:18px;margin-bottom:10px">Anote aí! O dia de hoje pode marcar o começo de uma nova história na sua vida.</p>
                            <p style="font-size:18px;margin-bottom:10px">O seu ebook está dentro da Plataforma TraderX, para acessá-lo basta apertar no link abaixo e entrar com o seu usuário e senha:</p>
                            <br/>
                              <p style="font-size:18px;margin:0px"><a href="https://app.otraderquemultiplica.com.br">https://app.otraderquemultiplica.com.br</a></p>
                              <p style="font-size:18px;margin:0px"><b>Usuário:</b> ${student_mail}</p>
                              <p style="font-size:18px;margin:0px"><b>Senha:</b> ${passwordHash}</p>
                            <br/>
                            <p style="font-size:18px;margin-bottom:10px">Ao entrar na área de alunos, basta ir em “Meus Cursos” no menu lateral e acessar o ebook e todos os bônus.</p>
                            <p style="font-size:18px;margin-bottom:10px">Em breve vou te mandar um outro e-mail falando sobre a Comunidade TraderX, onde você poderá ter acesso a uma formação completa e às salas de trade ao vivo para operar junto comigo.</p>
                            <p style="font-size:18px;margin-bottom:10px">Abração,<br/>
                            Guilherme</p>`;
                }else{
                  subject = '[Escola O Trader que Multiplica] Seus dados de acesso';
                  bodyText = `<p>${student_name}, parabéns pela decisão de entrar na Escola de Traders - O Trader que Multiplica!</p>
                          <p>É muito bom ter você junto de nós e poder te ajudar a se tornar um trader que multiplica.</p>
                          <p>O dia de hoje pode marcar o começo de uma nova história, uma história de liberdade, confiança e segurança para você e todos aqueles que ama.</p>
                          <p>Para acessar a plataforma aperte no link abaixo e coloque seu usuário e senha: <br/><br/>
                          <br/><br/>
                          <center>
                            <p><a href="https://app.otraderquemultiplica.com.br">app.otraderquemultiplica.com.br</a></p>
                            <p>Usuário: ${student_mail}</p>
                            <p>Senha: ${passwordHash}</p>
                          </center>
                          <br/>
                          <p>Ao acessar assista a primeira aula escrito "Comece Por Aqui" e siga os passos indicados nela para aproveitar todo conteúdo disponível na escola sem pular etapas, esse é um passo fundamental para que consiga obter resultados que deseja.</p>
                          <p>Espero muito em breve poder contar a sua história de sucesso!<br/>
                          <p>Abração,<br/>
                          Guilherme</p>`;
                }*/
            const from = 'Guilherme Cardoso';
            const fromMail = 'suporte@otraderquemultiplica.com.br';
            sendMail_1.default.sendMail(from, fromMail, student_mail, subject, bodyText, copy, hiddenCopy);
            //Enviando E-mail
            res.json({ success: true, message: `Aluno cadastrado com sucesso! Oferta: ${offer} Produto:${product_name}(${product_id})` });
        });
    }
    hotmartOld(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const callback = req.body;
            const date = (0, moment_1.default)();
            const hoje = date.format('YYYY-MM-DD');
            let evento = "";
            let acao = "";
            let codProduto = callback.prod;
            let nomeProduto = callback.prod_name;
            let cliente = callback.name;
            let emailCliente = callback.email;
            if (callback.status == 'approved') {
                evento = 'PURCHASE_APPROVED';
                acao = 'novoAcesso';
            }
            if (acao == "novoAcesso") {
                console.info("NOVO ALUNO");
                //Gerando Senha
                const length = 6;
                const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$&';
                let passwordHash = '';
                for (let i = 0; i < length; i++) {
                    const randomIndex = Math.floor(Math.random() * characters.length);
                    passwordHash += characters.charAt(randomIndex);
                }
                const plano = callback.name_subscription_plan
                    ? callback.name_subscription_plan
                    : callback.off
                        ? callback.off
                        : 'Sem Plano';
                //Checando Produto
                console.info('codProduto', codProduto);
                const infoProduct = yield IntegrationProductService_1.default.infoProductByCode(codProduto);
                //Check Product
                if (infoProduct) {
                    console.info("Product ", infoProduct.name);
                    const community = infoProduct.community_access;
                    //Check Offer
                    const offer = yield IntegrationOffersService_1.default.infoOfferByOfferPlatform(plano, infoProduct.id);
                    if (offer) {
                        console.info('Offer', offer.offer);
                        //AddCourses
                        const courses = yield IntegrationCoursesService_1.default.getCoursesPlatform(infoProduct.id, offer.id);
                        if (courses) {
                            //New Student 
                            const dataStudent = {
                                community: community,
                                type: 'student',
                                name: cliente,
                                photo: 0,
                                phone: "",
                                gender: "",
                                mail: emailCliente,
                                password: (0, md5_1.default)(passwordHash),
                                city: passwordHash,
                                reset: 1,
                                status: 1
                            };
                            const student = yield studentsService_1.default.createNewStudent(dataStudent);
                            if (student) {
                                yield studentsService_1.default.editStudent(student, { status: 1 });
                                courses.map((c, k) => __awaiter(this, void 0, void 0, function* () {
                                    const init = (0, moment_1.default)(hoje, 'YYYY-MM-DD');
                                    const dateValidity = c.validity_contract == "A" ? init.add(1, 'years').format('YYYY-MM-DD')
                                        : c.validity_contract == "SM" ? init.add(6, 'months').format('YYYY-MM-DD')
                                            : c.validity_contract == "T" ? init.add(3, 'months').format('YYYY-MM-DD')
                                                : c.validity_contract == "B" ? init.add(2, 'months').format('YYYY-MM-DD')
                                                    : c.validity_contract == "M" ? init.add(1, 'months').format('YYYY-MM-DD')
                                                        : c.validity_contract == "Q" ? init.add(15, 'days').format('YYYY-MM-DD')
                                                            : c.validity_contract == "S" ? init.add(7, 'days').format('YYYY-MM-DD')
                                                                : c.validity_contract == "V" ? init.add(50, 'years').format('YYYY-MM-DD')
                                                                    : init.add(1, 'days').format('YYYY-MM-DD');
                                    yield studentCoursesServices_1.default.addCourseStudent({
                                        student_id: student,
                                        course_id: c.course_id_students,
                                        status: 1,
                                        concluded: 0,
                                        data_valid: dateValidity
                                    });
                                    yield coursesValidityContractsService_1.default.addContract({
                                        student_id: student,
                                        course_id: c.course_id_students,
                                        start_validity: hoje,
                                        end_validity: dateValidity,
                                        payment_cycle: c.validity_contract
                                    });
                                }));
                                //Send Mail
                                let copia = 'lugheri@live.com';
                                let copiaOculta = 'lugheri@live.com';
                                let assunto = '[Escola O Trader que Multiplica] Seus dados de acesso';
                                let texto = "";
                                if (codProduto == 2304719) {
                                    assunto = '[Comunidade TraderX] Seu acesso está aqui!';
                                    texto = `<p style="font-size:18px;margin-bottom:10px">${cliente}, parabéns pela decisão de entrar na Comunidade TraderX.</p>
                           <p style="font-size:18px;margin-bottom:10px">É muito bom ter você junto de nós e poder te ajudar a se tornar um trader que multiplica.</p>
                           <p style="font-size:18px;margin-bottom:10px">O dia de hoje pode marcar o começo de uma nova história, uma história de liberdade, confiança e segurança para você e todos aqueles que ama.</p>
                           <p style="font-size:18px;margin-bottom:10px">Para acessar a plataforma aperte no link abaixo e entre com o seu usuário e senha:</p>
                           <br/>
                            <p style="font-size:18px;margin:0px"><a href="https://app.otraderquemultiplica.com.br">https://app.otraderquemultiplica.com.br</a></p>
                            <p style="font-size:18px;margin:0px"><b>Usuário:</b> ${emailCliente}</p>
                            <p style="font-size:18px;margin:0px"><b>Senha:</b> ${passwordHash}</p>
                           <br/>
                           <p style="font-size:18px;margin-bottom:10px">Ao entrar na área de alunos basta apertar em “Meus Cursos” no menu lateral para acessar todos os cursos que você tem acesso e aproveitar todo conteúdo disponível.</p>
                           <p style="font-size:18px;margin-bottom:10px">Comece pela Formação em Trading MétodoX, estude e pratique aula por aula sem pular etapas, esse é um passo fundamental para que consiga obter os resultados que deseja.</p>
                           <p style="font-size:18px;margin-bottom:10px">Espero muito em breve poder contar a sua história de sucesso!</p>
                           <p style="font-size:18px;margin-bottom:10px">Abração,<br/>
                           Guilherme</p>`;
                                }
                                else if (codProduto == 0) { //TESTE
                                    assunto = '[Mentoria TraderX] Seus dados de acesso!';
                                    texto = `<p style="font-size:18px;margin-bottom:10px">Faaaala Trader, tudo certo?</p>                                  
                         <p style="font-size:18px;margin-bottom:10px">Parabéns por tomar essa decisão que vai mudar o rumo dos seus resultados pelos próximos meses.</p>
                         <p style="font-size:18px;margin-bottom:10px"><strong>Esses são os seus dados de acesso para a área de alunos:</strong></p>
                         <p style="font-size:18px;margin-bottom:10px"><strong>Link: </strong><a href="https://app.otraderquemultiplica.com.br">app.otraderquemultiplica.com.br</a></p>
                         <p style="font-size:18px;margin-bottom:10px"><strong>Usuário: </strong>${emailCliente}</p>
                         <p style="font-size:18px;margin-bottom:10px"><strong>Senha: </strong>${passwordHash}</p> 
                         <p style="font-size:18px;margin-bottom:10px"><i>Agora tem algo muito importante que eu preciso que você faça para não perder nenhuma informação da mentoria.</i></p>
                         <p style="font-size:18px;margin-bottom:10px"><strong>Aperte no link abaixo e entre no grupo exclusivo para alunos da Mentoria TraderX no Telegram</strong>, ele será o nosso principal canal de comunicação durante os 2 meses de mentoria.</p>
                         <p style="font-size:18px;margin-bottom:10px"><strong style="font-size:20px">➡️ <a href="https://t.me/+PqO75q6smEA2ZWQx">ENTRAR NO GRUPO AGORA</a></strong></p>
                         <p style="font-size:18px;margin-bottom:10px">E se ainda tiver alguma dúvida pode responder esse e-mail ou enviar uma mensagem para o nosso WhatsApp de suporte. </p>
                         <p style="font-size:18px;margin-bottom:10px"><strong style="font-size:20px">➡️ <a href="https://bit.ly/suportegc">FALE COM O SUPORTE AQUI</a></strong></p>
                         <p style="font-size:18px;margin-bottom:10px"><strong>Parabéns pela decisão de se tornar um TraderX</strong>, um trader que multiplica, vamos juntos nessa jornada, vai ser incrível!</p>
                         <p style="font-size:18px;margin-bottom:10px">Abração,<br/>Guilherme</p>`;
                                }
                                else if (codProduto == 2770968) { //Ultima Mentoria
                                    assunto = '[Mentoria TraderX] Seus dados de acesso!';
                                    texto = `<p style="font-size:18px">Faaaala Trader, tudo certo?</p>                                  
                         <p style="font-size:18px">Parabéns por tomar essa decisão que vai mudar o rumo dos seus resultados pelos próximos meses.</p>
                         <p style="font-size:18px"><strong>Esses são os seus dados de acesso para a área de alunos:</strong></p>
                         <p style="font-size:18px;"><strong>Link: </strong><a href="https://app.otraderquemultiplica.com.br">app.otraderquemultiplica.com.br</a></p>
                         <p style="font-size:18px;"><strong>Usuário: </strong>${emailCliente}</p>
                         <p style="font-size:18px;"><strong>Senha: </strong>${passwordHash}</p> 
                         <p style="font-size:18px"><i>Agora tem algo muito importante que eu preciso que você faça para não perder nenhuma informação da mentoria.</i></p>
                         <p style="font-size:18px"><strong>Aperte no link abaixo e entre no grupo exclusivo para alunos da Mentoria TraderX no Telegram</strong>, ele será o nosso principal canal de comunicação durante os 2 meses de mentoria.</p>
                         <p style="font-size:18px"><strong style="font-size:20px">➡️ <a href="https://t.me/+PqO75q6smEA2ZWQx">ENTRAR NO GRUPO AGORA</a></strong></p>
                         <p style="font-size:18px">E se ainda tiver alguma dúvida pode responder esse e-mail ou enviar uma mensagem para o nosso WhatsApp de suporte. </p>
                         <p style="font-size:18px"><strong style="font-size:20px">➡️ <a href="https://bit.ly/suportegc">FALE COM O SUPORTE AQUI</a></strong></p>
                         <p style="font-size:18px"><strong>Parabéns pela decisão de se tornar um TraderX</strong>, um trader que multiplica, vamos juntos nessa jornada, vai ser incrível!</p>
                         <p style="font-size:18px">Abração,<br/>Guilherme</p>`;
                                }
                                else if (codProduto == 3131467) { //Ebook
                                    assunto = '[Ebook TraderX] Seu acesso está aqui!';
                                    texto = `<p style="font-size:18px;margin-bottom:10px">${cliente}, parabéns pela decisão de adquirir o seu Ebook O Trader que Multiplica.</p>
                          <p style="font-size:18px;margin-bottom:10px">É muito bom saber que você está buscando por mais conhecimento, e garanto que neste ebook você receberá um conteúdo de qualidade para começar no trading do jeito certo.</p>
                          <p style="font-size:18px;margin-bottom:10px">Anote aí! O dia de hoje pode marcar o começo de uma nova história na sua vida.</p>
                          <p style="font-size:18px;margin-bottom:10px">O seu ebook está dentro da Plataforma TraderX, para acessá-lo basta apertar no link abaixo e entrar com o seu usuário e senha:</p>
                          <br/>                         
                            <p style="font-size:18px;margin:0px"><a href="https://app.otraderquemultiplica.com.br">https://app.otraderquemultiplica.com.br</a></p>
                            <p style="font-size:18px;margin:0px"><b>Usuário:</b> ${emailCliente}</p>
                            <p style="font-size:18px;margin:0px"><b>Senha:</b> ${passwordHash}</p>                          
                          <br/>
                          <p style="font-size:18px;margin-bottom:10px">Ao entrar na área de alunos, basta ir em “Meus Cursos” no menu lateral e acessar o ebook e todos os bônus.</p>
                          <p style="font-size:18px;margin-bottom:10px">Em breve vou te mandar um outro e-mail falando sobre a Comunidade TraderX, onde você poderá ter acesso a uma formação completa e às salas de trade ao vivo para operar junto comigo.</p>
                          <p style="font-size:18px;margin-bottom:10px">Abração,<br/>
                          Guilherme</p>`;
                                }
                                else {
                                    let assunto = '[Escola O Trader que Multiplica] Seus dados de acesso';
                                    texto = `<p>${cliente}, parabéns pela decisão de entrar na Escola de Traders - O Trader que Multiplica!</p>
                         <p>É muito bom ter você junto de nós e poder te ajudar a se tornar um trader que multiplica.</p>
                         <p>O dia de hoje pode marcar o começo de uma nova história, uma história de liberdade, confiança e segurança para você e todos aqueles que ama.</p>
                         <p>Para acessar a plataforma aperte no link abaixo e coloque seu usuário e senha: <br/><br/>
                         <br/><br/>
                         <center>
                           <p><a href="https://app.otraderquemultiplica.com.br">app.otraderquemultiplica.com.br</a></p>
                           <p>Usuário: ${emailCliente}</p>
                           <p>Senha: ${passwordHash}</p>
                         </center>
                         <br/>
                         <p>Ao acessar assista a primeira aula escrito "Comece Por Aqui" e siga os passos indicados nela para aproveitar todo conteúdo disponível na escola sem pular etapas, esse é um passo fundamental para que consiga obter resultados que deseja.</p>
                         <p>Espero muito em breve poder contar a sua história de sucesso!<br/>
                         <p>Abração,<br/>
                         Guilherme</p>`;
                                }
                                // Configurações do transporte (SMTP)
                                const transporter = nodemailer_1.default.createTransport({
                                    host: 'smtp.titan.email',
                                    port: 465,
                                    secure: true,
                                    auth: {
                                        user: '',
                                        pass: '', // Senha do servidor SMTP
                                    },
                                });
                                // Opções do e-mail
                                const mailOptions = {
                                    from: 'Guilherme Cardoso <suporte@otraderquemultiplica.com.br>',
                                    to: emailCliente,
                                    cc: copia,
                                    bcc: copiaOculta,
                                    subject: assunto,
                                    html: texto,
                                };
                                // Envia o e-mail
                                transporter.sendMail(mailOptions, (error, info) => {
                                    if (error) {
                                        console.error('Erro ao enviar e-mail:', error);
                                    }
                                    else {
                                        console.info('E-mail enviado com sucesso! ID:', info.messageId);
                                    }
                                });
                            }
                        }
                    }
                }
            }
            //Enviando E-mail
            res.json(true);
        });
    }
    apiHotmart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const version = '1.0';
            const data = req.body;
            const status = data.status;
            const offer = data.off;
            const productId = data.prod;
            const productName = data.prod_name;
            //Customer Info
            const nameCustomer = data.name;
            const emailCustomer = data.email;
            const document = data.doc;
            const typeDoc = data.doc_type;
            const numberPhone = `${data.phone_local_code}${data.phone_number}`;
            const city = data.address_city;
            const state = data.address_state;
            //Offer Data
            const price = data.full_price;
            const orderBump = data.order_bump;
            console.info(data);
            res.json(true);
        });
    }
}
exports.default = new ApiController();
