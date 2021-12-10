import Link from "next/link";
import Image from "next/image";
import styles from "../styles/ProductDetail.module.css";
import {
    Nav,
    Navbar,
    NavDropdown,
    Container,
    Form,
    FormControl,
    FormGroup,
    InputGroup,
    Button,
    Col,
    Row,
    ControlLabel,
    Card,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import router from "next/router";
import { useCart } from "../context/CartContext";

const domain = process.env.NEXT_PUBLIC_API_DOMAIN_NAME;

const ProductDetail = ({ product }) => {

    const { cart, add_product } = useCart()

    const [cant, setCant] = useState(1);
    const [clothing_s, setClothingS] = useState('S');
    const [sleeve, setSleeve] = useState('Corta');
    const [fit, setFit] = useState('Regular Fit');
    const [price, setPrice] = useState(product.price);
    const [color, setColor] = useState("Default")
    const [changeColor, setChangeColor] = useState(false)
    const [images, setImages] = useState(null)
    const [currentImage, setCurrentImage] = useState(product.image)

    useEffect(async () => {
        await getImages(setImages, product.id)
    }, [])

    var body = JSON.stringify({
        cant,
        clothing_s,
        size_of_sleeve: sleeve,
        fit,
        original_product_id: product.id,
        price: product.price * cant,
        color,
    })

    const onBuyClickedHandler = async (e) => {
        e.preventDefault();

        var temp_color = color;
        if (changeColor == false) {
            temp_color = "Default"
        }

        if (cant > 0) {
            if (product.subtag === "ABAJO") {
                if (clothing_s === "S") {
                    body = JSON.stringify({
                        cant,
                        clothing_s: "32",
                        size_of_sleeve: "-1",
                        fit: "-1",
                        original_product_id: product.id,
                        price: product.price * cant,
                        color: temp_color,
                    })
                }
            }

            else if (product.subtag !== "ARRIBA") {
                body = JSON.stringify({
                    cant,
                    clothing_s,
                    size_of_sleeve: "-1",
                    fit: "-1",
                    original_product_id: product.id,
                    price: product.price * cant,
                    color: temp_color,
                })
            }
            if (color == 'Default' && changeColor == true) {
                alert("Select a custom color")
            }
            else {
                add_product(body)
            }

        }
    }


    console.log(images)

    return product == null || images == null ? (
        <div></div>
    ) : (
        <Container className={styles.productsDetailContainer}>
            <Row className={styles.row}>
                <Col
                    xs={12}
                    sm={12}
                    md={6}
                    lg={6}
                    className={styles.productCol}
                >
                    <Row>
                        <Col xs={12} sm={12} md={3} lg={3}>
                            <Card className={styles.s_images_card}>

                                {images.map((image, index) => {
                                    return (
                                        <div key={index} className={styles.s_images_div}>
                                            <Card.Img src={image.image} onMouseOver={e => setCurrentImage(e.target.src)} className={styles.card_s_image} alt='Image of product' />
                                        </div>
                                    )
                                })}
                            </Card>
                        </Col>

                        <Col xs={12} sm={12} md={9} lg={9}>
                            <Card className={styles.card_image_mcard}>
                                <Card.Img variant="top" src={currentImage} className={styles.card_image} />
                            </Card>
                        </Col>
                    </Row>
                </Col>
                <Col
                    xs={12}
                    sm={12}
                    md={6}
                    lg={6}
                    className={styles.productCol}
                >
                    <div className={styles.card_div}>
                        <Card className={styles.card}>
                            <Card.Body className={styles.card_body}>
                                {product.subtag === "ARRIBA" ? (
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Talla de Ropa</Form.Label>
                                        <Form.Select aria-label="Default select example" onChange={(e) => setClothingS(e.target.value)}>
                                            <option value="S">S</option>
                                            <option value="M">M</option>
                                            <option value="L">L</option>
                                        </Form.Select>
                                    </Form.Group>
                                ) : (
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Talla de Ropa</Form.Label>
                                        <Form.Select aria-label="Default select example" onChange={(e) => setClothingS(e.target.value)}>
                                            <option value="32">32</option>
                                            <option value="34">34</option>
                                            <option value="36">36</option>
                                        </Form.Select>
                                    </Form.Group>
                                )}

                                {product.subtag === "ARRIBA" ? (
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Corte</Form.Label>
                                        <Form.Select aria-label="Default select example" onChange={(e) => setFit(e.target.value)}>
                                            <option value="Regular Fit">Regular Fit</option>
                                            <option value="Slim Fit">Slim Fit</option>
                                        </Form.Select>
                                    </Form.Group>
                                ) : <div></div>}

                                {product.subtag === "ARRIBA" ? (
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Largo de Manga</Form.Label>
                                        <Form.Select aria-label="Default select example" onChange={(e) => setSleeve(e.target.value)}>
                                            <option value="Corta">Corta</option>
                                            <option value="Larga">Larga</option>
                                        </Form.Select>
                                    </Form.Group>
                                ) : <div></div>}

                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Cantidad</Form.Label>
                                    <Form.Control type="number" onChange={(e) => setCant(e.target.value)} value={cant} />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Check
                                        inline
                                        name="group1"
                                        type="checkbox"
                                        id="checkbox_color"
                                        checked={changeColor === true}
                                        onChange={e => setChangeColor(e.target.checked)}
                                    />
                                    <Form.Label>
                                        Custom Color
                                    </Form.Label>
                                </Form.Group>


                                {(changeColor === true) ? <div>
                                    <Row>
                                        {product.available_colors.map((ecolor, index) => {
                                            var sel_outline = '';
                                            if (ecolor.code == color) {
                                                sel_outline = '3px solid royalblue'
                                            }
                                            else {
                                                sel_outline = '1px solid black'
                                            }
                                            return (
                                                <Col key={index} xs={4} sm={4} md={3} lg={2}>
                                                    <div style={{}}>
                                                        <div onClick={e => setColor(ecolor.code)} key={index} style={{ backgroundColor: ecolor.code, height: '25px', width: '25px', border: "1px solid white", borderRadius: "30px", outline: sel_outline }} />
                                                    </div>
                                                </Col>
                                            )
                                        })}
                                    </Row>
                                </div> : <div></div>}


                            </Card.Body>
                            <Card.Footer className={styles.card_footer}>
                                <Button className={styles.button} onClick={(e) => onBuyClickedHandler(e)}>Comprar</Button>
                            </Card.Footer>
                        </Card>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};


const getImages = (setImages, id) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    const prod_images_url = domain + `store/product-images/${id}/`;
    axios
        .get(prod_images_url, config)
        .then(async (res) => {
            const result = await res.data['Images'];
            setImages(result);
        })
        .catch((error) => {
            console.log(error);
        });
}




export default ProductDetail;